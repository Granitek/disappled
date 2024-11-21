from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Pobierz token z ciasteczka
        raw_token = request.COOKIES.get('access_token')
        if raw_token is None:
            return None  # Brak tokena w ciasteczku
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
