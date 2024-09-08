from reciperobot.measures.models import Measure, MeasureAlias


def test_measure_get_absolute_url(measure: Measure):
    assert measure.get_absolute_url() == f"/api/measures/{measure.pk}/"

def test_measure_alias_get_absolute_url(measure_alias: MeasureAlias):
    assert measure_alias.get_absolute_url() \
        == f"/api/measure_aliases/{measure_alias.pk}/"
