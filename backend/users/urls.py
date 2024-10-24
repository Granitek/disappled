from django.urls import path
from .views import LoginView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Ścieżka do logowania (uzyskania tokenu access i refresh)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Ścieżka do odświeżenia tokenu access
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', LoginView.as_view(), name='login')
]