from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    listen_to_wakewords = models.BooleanField(default=False)
    font_size = models.CharField(
        max_length=10,
        choices=[('Small', 'Small'), ('Medium', 'Medium'), ('Large', 'Large')],
        default='Medium'
    )

    def __str__(self):
        return f"{self.user.username}'s profile"
