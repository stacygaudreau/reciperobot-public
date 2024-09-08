from rest_framework import serializers

from reciperobot.ingredients.models import Ingredient


class IngredientSerializer(serializers.ModelSerializer[Ingredient]):
    class Meta:
        model = Ingredient
        fields = ["id", "name", "url"]
        read_only_fields = ["id"]

        extra_kwargs = {
            "url": {"view_name": "api:ingredient-detail", "lookup_field": "pk"},
        }