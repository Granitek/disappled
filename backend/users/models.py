from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    listen_to_wakewords = models.BooleanField(default=True)  # Domyślnie nasłuchiwanie aktywne

    def __str__(self):
        return f"{self.user.username}'s profile"
