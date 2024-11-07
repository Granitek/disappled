from django.urls import path
from .views import LoginView, RegisterView, UserProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Ścieżka do logowania (uzyskania tokenu access i refresh)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Ścieżka do odświeżenia tokenu access
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]