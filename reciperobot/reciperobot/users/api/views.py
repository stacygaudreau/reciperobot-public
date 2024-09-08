from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.mixins import UpdateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token
from django.http import JsonResponse


from reciperobot.users.models import User
from reciperobot.recipes.models import Recipe

from .serializers import UserSerializer, SetComposerRecipeSerializer


class UserViewSet(RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "username"

    def get_queryset(self, *args, **kwargs):
        assert isinstance(self.request.user.id, int)
        return self.queryset.filter(id=self.request.user.id)

    @action(detail=False)
    def me(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class SetComposerRecipeView(GenericAPIView):
    """
    Set the recipe being edited in the Recipe Composer for
    the current authenticated user.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SetComposerRecipeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        recipe_id = serializer.validated_data["recipe_id"]
        recipe = get_object_or_404(Recipe, id=recipe_id)
        if recipe.user != request.user:
            return Response({"error": "You do not have permission to edit this recipe."},
                            status=status.HTTP_403_FORBIDDEN)
        request.user.composer_recipe = recipe
        request.user.save()

        return Response({"success": "Composer recipe set", "id": recipe.id},
                        status=status.HTTP_200_OK)

def csrf_token_view(request):
    return JsonResponse({"csrfToken": get_token(request)})

