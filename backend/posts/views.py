from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    #przypisuje zalogowanego użytkownika jako autora
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        return Post.objects.all()
    
    # Funkcja get_permissions dla bardziej złożonych uprawnień
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            # Używaj IsAuthorOrReadOnly tylko dla operacji edycji i usuwania
            return [IsAuthorOrReadOnly()]
        return super().get_permissions()