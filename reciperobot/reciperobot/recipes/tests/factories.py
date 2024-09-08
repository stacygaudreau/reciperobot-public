from factory import LazyFunction, SubFactory
from factory.django import DjangoModelFactory
from faker import Faker

from reciperobot.recipes.models import Recipe, RecipeIngredient, RecipeStep
from reciperobot.users.tests.factories import UserFactory
from reciperobot.ingredients.tests.factories import IngredientFactory
from reciperobot.measures.tests.factories import MeasureFactory


faker = Faker()

class RecipeFactory(DjangoModelFactory):
    name = LazyFunction(lambda: faker.sentence(nb_words=3))
    description = LazyFunction(lambda: faker.text(max_nb_chars=500))
    user = SubFactory(UserFactory)
    version = LazyFunction(faker.random_digit_above_two)
    is_public = LazyFunction(faker.boolean)

    class Meta:
        model =  Recipe


class RecipeIngredientFactory(DjangoModelFactory):
    recipe = SubFactory(RecipeFactory)
    ingredient = SubFactory(IngredientFactory)
    measure = SubFactory(MeasureFactory)
    qty_float = LazyFunction(faker.random_digit_above_two)
    qty_numerator = LazyFunction(faker.random_digit)
    qty_denominator = LazyFunction(faker.random_digit)
    modifier = LazyFunction(faker.word)
    order = LazyFunction(faker.random_digit_not_null)

    class Meta:
        model =  RecipeIngredient


class RecipeStepFactory(DjangoModelFactory):
    recipe = SubFactory(RecipeFactory)
    text = LazyFunction(lambda: faker.text(max_nb_chars=300))
    order = LazyFunction(faker.random_digit_not_null)

    class Meta:
        model =  RecipeStep
