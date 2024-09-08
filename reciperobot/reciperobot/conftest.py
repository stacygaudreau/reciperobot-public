import pytest
from django.core.management import call_command

from reciperobot.users.models import User
from reciperobot.users.tests.factories import UserFactory
from reciperobot.ingredients.models import Ingredient
from reciperobot.ingredients.tests.factories import IngredientFactory
from reciperobot.recipes.tests.factories import RecipeFactory, RecipeIngredientFactory, RecipeStepFactory
from reciperobot.recipes.models import Recipe, RecipeIngredient, RecipeStep
from reciperobot.measures.models import Measure, MeasureAlias
from reciperobot.measures.tests.factories import MeasureFactory, MeasureAliasFactory


@pytest.fixture(autouse=True)
def _media_storage(settings, tmpdir) -> None:
    settings.MEDIA_ROOT = tmpdir.strpath


@pytest.fixture()
def user(db) -> User:
    return UserFactory()

@pytest.fixture()
def ingredient(db) -> Ingredient:
    return IngredientFactory()

@pytest.fixture()
def recipe(db) -> Recipe:
    return RecipeFactory()

@pytest.fixture()
def measure(db) -> Measure:
    return MeasureFactory()

@pytest.fixture()
def measure_alias(db) -> MeasureAlias:
    return MeasureAliasFactory()

@pytest.fixture()
def recipe_ingredient(db) -> RecipeIngredient:
    return RecipeIngredientFactory()

@pytest.fixture()
def recipe_step(db) -> RecipeStep:
    return RecipeStepFactory()
