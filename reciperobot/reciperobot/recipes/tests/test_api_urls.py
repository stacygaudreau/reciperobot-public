from django.urls import resolve
from django.urls import reverse

from reciperobot.recipes.models import Recipe, RecipeIngredient, RecipeStep


def test_recipe_detail(recipe: Recipe):
    assert (
        reverse("api:recipe-detail", kwargs={"pk": recipe.pk})
        == f"/api/recipes/{recipe.pk}/"
    )
    assert resolve(f"/api/recipes/{recipe.pk}/").view_name == "api:recipe-detail"

def test_recipe_list():
    assert reverse("api:recipe-list") == "/api/recipes/"
    assert resolve("/api/recipes/").view_name == "api:recipe-list"

def test_recipe_ingredients_list_by_recipe_id(recipe: Recipe):
    # the list of ingredients' endpoint can be found by recipe ID
    url = reverse("api:recipe-recipe_ingredients", kwargs={"pk": recipe.id})
    assert url == f"/api/recipes/{recipe.id}/recipe_ingredients/"
    view_name = resolve(f"/api/recipes/{recipe.id}/recipe_ingredients/").view_name
    assert view_name == "api:recipe-recipe_ingredients"

def test_recipe_steps_list_by_recipe_id(recipe: Recipe):
    # the list of steps' endpoint can be found by recipe ID
    url = reverse("api:recipe-recipe_steps", kwargs={"pk": recipe.id})
    assert url == f"/api/recipes/{recipe.id}/recipe_steps/"
    view_name = resolve(f"/api/recipes/{recipe.id}/recipe_steps/").view_name
    assert view_name == "api:recipe-recipe_steps"

def test_recipe_ingredient_detail(recipe_ingredient: RecipeIngredient):
    assert (
        reverse("api:recipe_ingredient-detail",
                kwargs={"pk": recipe_ingredient.pk})
        == f"/api/recipe_ingredients/{recipe_ingredient.pk}/"
    )
    assert resolve(f"/api/recipe_ingredients/{recipe_ingredient.pk}/")\
        .view_name == "api:recipe_ingredient-detail"

def test_recipes_public():
    assert (
        reverse("api:recipe-public") == "/api/recipes/public/"
    )
    assert resolve("/api/recipes/public/").view_name == "api:recipe-public"

def test_recipes_mine():
    assert (
        reverse("api:recipe-mine") == "/api/recipes/mine/"
    )
    assert resolve("/api/recipes/mine/").view_name == "api:recipe-mine"

def test_recipe_step_detail(recipe_step: RecipeStep):
    assert (
        reverse("api:recipe_step-detail",
                kwargs={"pk": recipe_step.pk})
        == f"/api/recipe_steps/{recipe_step.pk}/"
    )
    assert resolve(f"/api/recipe_steps/{recipe_step.pk}/")\
        .view_name == "api:recipe_step-detail"
