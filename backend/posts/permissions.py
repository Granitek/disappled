from rest_framework.permissions import BasePermission

class IsAuthorOrReadOnly(BasePermission):
    """
    Custom permission to only allow authors of a post to edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'HEAD', 'OPTIONS']: # Opcje dla użytkowników nie będacych autorem posta
            return True

        return obj.author == request.user # Zezwala na modyfikację posta tylko dla autora