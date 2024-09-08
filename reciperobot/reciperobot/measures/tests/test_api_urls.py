from django.urls import resolve
from django.urls import reverse

from reciperobot.measures.models import Measure, MeasureAlias


def test_measure_detail(measure: Measure):
    assert (
        reverse("api:measure-detail", kwargs={"pk": measure.pk})
        == f"/api/measures/{measure.pk}/"
    )
    assert resolve(f"/api/measures/{measure.pk}/").view_name == "api:measure-detail"

def test_measure_list():
    assert reverse("api:measure-list") == "/api/measures/"
    assert resolve("/api/measures/").view_name == "api:measure-list"


def test_measure_alias_detail(measure_alias: MeasureAlias):
    assert (
        reverse("api:measure_alias-detail", kwargs={"pk": measure_alias.pk})
        == f"/api/measure_aliases/{measure_alias.pk}/"
    )
    assert resolve(f"/api/measure_aliases/{measure_alias.pk}/")\
        .view_name == "api:measure_alias-detail"

def test_measure_alias_list():
    assert reverse("api:measure_alias-list") == "/api/measure_aliases/"
    assert resolve("/api/measure_aliases/").view_name == "api:measure_alias-list"
