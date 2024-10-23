from django.db import models
from django.contrib.auth.models import User
# Create your models here.

def get_default_user():
    return User.objects.first()

class Post(models.Model):
    title = models.CharField(max_length=75)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=get_default_user)

    def __str__(self):
        return self.title