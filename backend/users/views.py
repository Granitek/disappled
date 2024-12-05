from django.shortcuts import render

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework import status

from rest_framework import generics, permissions
from .serializers import RegisterSerializer

from django.contrib.auth.models import User
from posts.models import Post
from posts.serializers import PostSerializer
from .serializers import UserSerializer

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import AllowAny


class LoginView(APIView):
    # permission_classes = [AllowAny]

    authentication_classes = []  # Brak wymagań autoryzacji
    permission_classes = []  # Brak wymagań uprawnień

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)

            response = Response({
                'message': 'Login successful',
                'username': username,
            }, status=status.HTTP_200_OK)

            # Ustaw tokeny w ciasteczkach
            response.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,  # Chroni przed XSS
                # secure=True,    # Wymaga HTTPS
                # samesite='Strict',
                secure=False,
                samesite='Lax'
            )
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                # secure=True,
                # samesite='Strict',
                secure=False,
                samesite='Lax'
            )
            return response
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Przepisz nowy access_token do ciasteczka
        access_token = response.data.get('access')
        if access_token:
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='Strict',
            )
        return response

# class LoginView(APIView):
#     def post(self, request, *args, **kwargs):
#         username = request.data.get('username')
#         password = request.data.get('password')
#         user = authenticate(username=username, password=password)

#         if user is not None:
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'access': str(refresh.access_token),
#                 'refresh': str(refresh),
#                 'user': {
#                     'id': user.id,
#                     'username': user.username,
#                 }
#             }, status=status.HTTP_200_OK)
#         else:
#             return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": {
                    "username": user.username,
                    "email": user.email,
                }
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # print("Cookies received:", request.COOKIES)  # Sprawdź, czy ciasteczko access_token jest obecne
        # print("Authorization Header:", request.headers.get('Authorization'))  # Czy nagłówek JWT jest obecny?
        # print("Authenticated user:", request.user)  # Czy użytkownik jest rozpoznawany?

        if not request.user.is_authenticated:
            return Response({"detail": "Authentication failed"}, status=401)

        user = request.user
        user_data = UserSerializer(user).data
        user_posts = Post.objects.filter(author=user)
        user_posts_data = PostSerializer(user_posts, many=True).data
        listen_to_wakewords = user.profile.listen_to_wakewords

        return Response({
            "user": user_data,
            "posts": user_posts_data,
            "listen_to_wakewords": listen_to_wakewords
        })
    
    def put(self, request, *args, **kwargs):
        profile = request.user.profile
        profile.listen_to_wakewords = request.data.get('listen_to_wakewords', profile.listen_to_wakewords)
        profile.save()
        return Response({"message": "Profile updated successfully"})
    


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

        # Usuń ciasteczka
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response