from factory import LazyFunction, SubFactory
from factory.django import DjangoModelFactory
from faker import Faker

from reciperobot.measures.models import Measure, MeasureAlias


faker = Faker()

class MeasureFactory(DjangoModelFactory):

    name = LazyFunction(faker.word)
    unit_type = LazyFunction(faker.word)

    class Meta:
        model =  Measure


class MeasureAliasFactory(DjangoModelFactory):

    name = LazyFunction(lambda: faker.word())
    measure = SubFactory(MeasureFactory)

    class Meta:
        model =  MeasureAlias
