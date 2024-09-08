from factory import LazyFunction, SubFactory
from factory.django import DjangoModelFactory
from faker import Faker

from reciperobot.ingredients.models import Ingredient
from reciperobot.users.tests.factories import UserFactory


faker = Faker()

class IngredientFactory(DjangoModelFactory):

    name = LazyFunction(lambda: faker.sentence(nb_words=3))
    user = SubFactory(UserFactory)

    class Meta:
        model =  Ingredient
        django_get_or_create = ["name"]