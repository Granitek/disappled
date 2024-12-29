from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'image', 'image_url', 'created_at']
        read_only_fields = ['author']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(f"/api{obj.image.url}")
            return f"/api{obj.image.url}"
        return None