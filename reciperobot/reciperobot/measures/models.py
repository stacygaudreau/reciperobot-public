from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from django.contrib.auth import get_user_model

User = get_user_model()

class Measure(models.Model):
    """
    Unit to measure an ingredient with.
    """
    name = models.CharField(_("The display label for the unit, eg: 'mL'"),
                            max_length=50)
    unit_type = models.CharField(_("Type of measurement, eg: weight"),
                                 max_length=50)

    class Meta:
        verbose_name = _("Measure")
        verbose_name_plural = _("Measures")

    def __str__(self):
        return self.name

    def get_absolute_url(self) -> str:
        return reverse("api:measure-detail", kwargs={"pk": self.pk})


class MeasureAlias(models.Model):
    """
    Shorthand alias rep'n for matching a measurement unit.
    For example, the "pound" measure can be represented as "lb", as well.
    """
    name = models.CharField(_("Alias name"), max_length=50)
    measure = models.ForeignKey(Measure, on_delete=models.CASCADE,
                                related_name="measure_aliases")

    class Meta:
        verbose_name = _("MeasureAlias")
        verbose_name_plural = _("MeasureAliases")

    def __str__(self):
        return f"{self.name if self.name != '' else 'NULL'} -> {self.measure.name}"

    def get_absolute_url(self) -> str:
        return reverse("api:measure_alias-detail", kwargs={"pk": self.pk})


