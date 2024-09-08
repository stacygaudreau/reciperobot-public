from django.db.models import Q
from django.db.models.query import QuerySet
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.mixins import CreateModelMixin
from rest_framework.mixins import DestroyModelMixin
from rest_framework.mixins import ListModelMixin
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.mixins import UpdateModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from reciperobot.recipes.models import Recipe
from reciperobot.recipes.models import RecipeIngredient
from reciperobot.recipes.models import RecipeStep

from .permissions import ReadOnlyWhenOwnerMakesPublic
from .serializers import RecipeIngredientSerializer
from .serializers import RecipeSerializer
from .serializers import RecipeStepSerializer


class RecipeViewSet(CreateModelMixin, ListModelMixin, RetrieveModelMixin,
                    UpdateModelMixin, DestroyModelMixin, GenericViewSet):
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.all()
    permission_classes = [ReadOnlyWhenOwnerMakesPublic]

    # recipes with is_public field set can be read by anyone
    # authenticated users can also read and edit their own recipes
    def get_queryset(self) -> QuerySet:
        if self.request.user.is_authenticated:
            return self.queryset.filter(Q(user=self.request.user) | Q(is_public=True))
        else:  # noqa: RET505
            return self.queryset.filter(is_public=True)

    # the inserted recipe is owned by the POSTing user
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get"], url_path="recipe_ingredients",
            url_name="recipe_ingredients")
    def recipe_ingredients(self, request, pk=None):
        """
        List all the RecipeIngredients in a given recipe, by ID.
        Ingredients are ordered by their order field.
        """
        q = self.get_queryset()
        recipe = get_object_or_404(q, id=pk)
        recipe_ingredients = RecipeIngredient.objects\
            .filter(recipe=recipe).order_by("order")
        serializer = RecipeIngredientSerializer(recipe_ingredients,
                                                many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="recipe_steps",
            url_name="recipe_steps")
    def recipe_steps(self, request, pk=None):
        """
        List all the RecipeSteps in a given recipe, by ID.
        Steps are ordered by their order field.
        """
        q = self.get_queryset()
        recipe = get_object_or_404(q, id=pk)
        recipe_steps = RecipeStep.objects\
            .filter(recipe=recipe).order_by("order")
        serializer = RecipeStepSerializer(recipe_steps, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="public",
            url_name="public")
    def public(self, request, *args, **kwargs):
        """
        List all public recipes in the database.
        """
        q = self.get_queryset().filter(is_public=True)
        page = self.paginate_queryset(q)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(q, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="mine",
            url_name="mine")
    def mine(self, request, *args, **kwargs):
        """
        List (only) the recipes owned by the currently
        authenticated user.
        """
        if not request.user.is_authenticated:
            err = "Forbidden. You must be authenticated."
            raise PermissionDenied(err)
        q = self.get_queryset().filter(user=request.user)
        page = self.paginate_queryset(q)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(q, many=True)
        return Response(serializer.data)


class RecipeIngredientViewSet(CreateModelMixin, RetrieveModelMixin,
                              UpdateModelMixin, DestroyModelMixin,
                              GenericViewSet):
    serializer_class = RecipeIngredientSerializer
    queryset = RecipeIngredient.objects.all()
    permission_classes = [IsAuthenticated]

    # the user retrieves only their own objects
    def get_queryset(self) -> QuerySet:
        return self.queryset.filter(recipe__user=self.request.user)


class RecipeStepViewSet(CreateModelMixin, RetrieveModelMixin,
                        UpdateModelMixin, DestroyModelMixin,
                        GenericViewSet):
    serializer_class = RecipeStepSerializer
    queryset = RecipeStep.objects.all()
    permission_classes = [IsAuthenticated]

    # the user retrieves only their own objects
    def get_queryset(self) -> QuerySet:
        return self.queryset.filter(recipe__user=self.request.user)
