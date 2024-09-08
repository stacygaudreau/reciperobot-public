from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet

from reciperobot.measures.models import Measure, MeasureAlias
from .serializers import MeasureSerializer, MeasureAliasSerializer


class MeasureViewSet(ListModelMixin, RetrieveModelMixin,
                     GenericViewSet):
    serializer_class = MeasureSerializer
    queryset = Measure.objects.all()

class MeasureAliasViewSet(ListModelMixin, RetrieveModelMixin,
                          GenericViewSet):
    serializer_class = MeasureAliasSerializer
    queryset = MeasureAlias.objects.all()