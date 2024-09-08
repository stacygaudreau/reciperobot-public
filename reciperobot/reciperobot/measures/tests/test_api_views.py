import pytest
from rest_framework.test import APIRequestFactory

from reciperobot.measures.api.views import MeasureViewSet, MeasureAliasViewSet
from reciperobot.measures.models import Measure, MeasureAlias
