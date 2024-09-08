from reciperobot.ingredients.models import Ingredient


def test_ingredient_get_absolute_url(ingredient: Ingredient):
    assert ingredient.get_absolute_url() == f"/api/ingredients/{ingredient.pk}/"
