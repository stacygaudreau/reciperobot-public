from reciperobot.recipes.models import Recipe, RecipeIngredient, RecipeStep


def test_recipe_get_absolute_url(recipe: Recipe):
    assert recipe.get_absolute_url() == f"/api/recipes/{recipe.pk}/"

def test_recipe_ingredient_get_absolute_url(recipe_ingredient: RecipeIngredient):
    assert recipe_ingredient.get_absolute_url() \
        == f"/api/recipe_ingredients/{recipe_ingredient.pk}/"

def test_recipe_step_get_absolute_url(recipe_step: RecipeStep):
    assert recipe_step.get_absolute_url() \
        == f"/api/recipe_steps/{recipe_step.pk}/"
