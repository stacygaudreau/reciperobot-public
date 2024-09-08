from rest_framework import serializers
from datetime import datetime
from rest_framework.reverse import reverse

from reciperobot.recipes.models import Recipe, RecipeIngredient, RecipeStep


class RecipeSerializer(serializers.ModelSerializer[Recipe]):
    user_username = serializers.SerializerMethodField()
    created_date = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ["id",
                  "name",
                  "description",
                  "version",
                  "is_public",
                  "user",
                  "user_username",
                  "created_date",
                  "url"]
        read_only_fields = ["id",
                            "user"]

        extra_kwargs = {
            "url": {"view_name": "api:recipe-detail", "lookup_field": "pk"},
        }

    def get_user_username(self, obj) -> str:
        if isinstance(obj, Recipe):
            return obj.user.username if obj.user else None
        elif isinstance(obj, dict):
            return obj.get("user_username")
        return None

    def get_created_date(self, obj) -> str:
        # Check if obj is a model instance or a dictionary
        if isinstance(obj, Recipe):
            return obj.created.strftime("%Y-%m-%d") if obj.created else None
        elif isinstance(obj, dict):
            return obj.get("created_date")
        return None

    def get_url(self, obj) -> str:
        request = self.context.get('request')
        if isinstance(obj, Recipe):
            return reverse("api:recipe-detail", kwargs={"pk": obj.pk}, request=request)
        elif isinstance(obj, dict):
            return reverse("api:recipe-detail", kwargs={"pk": obj.get("id")}, request=request)
        return None


class RecipeIngredientSerializer(serializers.ModelSerializer[RecipeIngredient]):
    ingredient_name = serializers.SerializerMethodField()
    measure_name = serializers.SerializerMethodField()

    class Meta:
        model = RecipeIngredient
        fields = ["id",
                  "order",
                  "qty_float",
                  "qty_numerator",
                  "qty_denominator",
                  "modifier",
                  "measure",
                  "measure_name",
                  "ingredient",
                  "ingredient_name",
                  "recipe",
        ]
        read_only_fields = ["id"]

    def get_ingredient_name(self, obj) -> str:
        return obj.ingredient.name if obj.ingredient else None
    
    def get_measure_name(self, obj) -> str:
        return obj.measure.name if obj.measure else None
    

class RecipeStepSerializer(serializers.ModelSerializer[RecipeStep]):
    class Meta:
        model = RecipeStep
        fields = ["id",
                  "order",
                  "recipe",
                  "text",
        ]
        read_only_fields = ["id"]
