from rest_framework import serializers

from reciperobot.measures.models import Measure, MeasureAlias


class MeasureSerializer(serializers.ModelSerializer[Measure]):
    class Meta:
        model = Measure
        fields = ["id", "name", "unit_type", "url"]
        read_only_fields = ["id"]

        extra_kwargs = {
            "url": {"view_name": "api:measure-detail", "lookup_field": "pk"},
        }

class MeasureAliasSerializer(serializers.ModelSerializer[MeasureAlias]):
    class Meta:
        model = MeasureAlias
        fields = ["id", "name", "measure", "url"]

        extra_kwargs = {
            "url": {"view_name": "api:measure_alias-detail", "lookup_field": "pk"},
        }
