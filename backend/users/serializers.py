from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import UserProfile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    listen_to_wakewords = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'listen_to_wakewords']

    def create(self, validated_data):
        listen_to_wakewords = validated_data.pop('listen_to_wakewords', False)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        user.profile.listen_to_wakewords = listen_to_wakewords
        user.profile.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['listen_to_wakewords', 'font_size']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']
