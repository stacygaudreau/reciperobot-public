from django.db.models.query import QuerySet
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import IsAuthenticated

from reciperobot.ingredients.models import Ingredient
from .serializers import IngredientSerializer


class IngredientViewSet(CreateModelMixin, ListModelMixin, RetrieveModelMixin,
                        UpdateModelMixin, DestroyModelMixin, GenericViewSet):
    serializer_class = IngredientSerializer
    queryset = Ingredient.objects.all()
    permission_classes = [IsAuthenticated]

    # the user can only get their own ingredients
    def get_queryset(self) -> QuerySet:
        return self.queryset.filter(user=self.request.user)

    # the ingredient is owned by the POSTing user
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
