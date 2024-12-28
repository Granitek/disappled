from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .services import generate_image_from_title
import os
# services.py
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from .services import generate_image_from_title
# import os
from django.conf import settings

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    #przypisuje zalogowanego użytkownika jako autora
    # def perform_create(self, serializer):
    #     serializer.save(author=self.request.user)
    
    # Przypisuje zalogowanego użytkownika jako autora i generuje obraz
    def perform_create(self, serializer):
        title = self.request.data.get("title")
        image = self.request.data.get("image")

        # Generowanie obrazu
        # if title:
        if not image and title:
            try:
                image_data = generate_image_from_title(title)
                # image_path = f"generated_images/{title.replace(' ', '_')}.png"
                relative_image_path = f"generated_images/{title.replace(' ', '_')}.png"
                image_path = os.path.join(settings.MEDIA_ROOT, relative_image_path)
                # Zapis obrazu w folderze "media"
                os.makedirs(os.path.dirname(image_path), exist_ok=True)
                with open(image_path, "wb") as f:
                    f.write(image_data)

                # Zapisywanie posta z wygenerowanym obrazem
                serializer.save(author=self.request.user, image=relative_image_path)
            except Exception as e:
                raise ValueError(f"Image generation failed: {str(e)}")
        else:
            serializer.save(author=self.request.user)  # Bez obrazu, jeśli brak tytułu

    def get_queryset(self):
        return Post.objects.all()
    
    # Dodanie obsługi obrazu podczas aktualizacji posta
    def perform_update(self, serializer):
        title = self.request.data.get("title")
        image = self.request.data.get("image")
        
        # if title:
        if not image and title:
            try:
                image_data = generate_image_from_title(title)
                relative_image_path = f"generated_images/{title.replace(' ', '_')}.png"
                image_path = os.path.join(settings.MEDIA_ROOT, relative_image_path)
                os.makedirs(os.path.dirname(image_path), exist_ok=True)
                with open(image_path, "wb") as f:
                    f.write(image_data)

                serializer.save(image=relative_image_path)
            except Exception as e:
                raise ValueError(f"Image generation failed: {str(e)}")
        else:
            serializer.save()

    # Funkcja get_permissions dla bardziej złożonych uprawnień
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            # Używaj IsAuthorOrReadOnly tylko dla operacji edycji i usuwania
            return [IsAuthorOrReadOnly()]
        return super().get_permissions()
    
    def get_serializer_context(self):
        # Dodaj kontekst dla 'image_url'
        context = super().get_serializer_context()
        context['request'] = self.request
        return context