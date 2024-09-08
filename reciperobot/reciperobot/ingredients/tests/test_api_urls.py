from django.urls import resolve
from django.urls import reverse

from reciperobot.ingredients.models import Ingredient


def test_ingredient_detail(ingredient: Ingredient):
    assert (
        reverse("api:ingredient-detail", kwargs={"pk": ingredient.pk})
        == f"/api/ingredients/{ingredient.pk}/"
    )
    assert resolve(f"/api/ingredients/{ingredient.pk}/").view_name == "api:ingredient-detail"


def test_ingredient_list():
    assert reverse("api:ingredient-list") == "/api/ingredients/"
    assert resolve("/api/ingredients/").view_name == "api:ingredient-list"
