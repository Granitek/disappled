from rest_framework.permissions import BasePermission

class IsAuthorOrReadOnly(BasePermission):
    """
    Custom permission to only allow authors of a post to edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Zezwól na odczyt dla wszystkich
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # Zezwól na edycję i usunięcie tylko, jeśli użytkownik jest autorem postu
        return obj.author == request.user
