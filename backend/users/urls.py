from django.urls import path
from .views import LoginView, CustomTokenRefreshView, RegisterView, UserProfileView, LogoutView
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )

urlpatterns = [
    # # Ścieżka do logowania (uzyskania tokenu access i refresh)
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # # Ścieżka do odświeżenia tokenu access
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
]