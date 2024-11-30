from rest_framework import serializers
from .models import Post

# class PostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Post
#         fields = ['id', 'title', 'content', 'author']
#         read_only_fields = ['author']

class PostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'image', 'image_url']  # Dodaj 'image_url'
        read_only_fields = ['author']

    def get_image_url(self, obj):
        request = self.context.get('request')
        # if obj.image:
        if request:
            return request.build_absolute_uri(f"/api{obj.image.url}")
        # return None
        return f"/api{obj.image.url}" if obj.image else None