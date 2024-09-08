from django.contrib.auth import get_user_model
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django_extensions.db.models import TimeStampedModel

User = get_user_model()

class Ingredient(TimeStampedModel, models.Model):

    name = models.CharField(_("Ingredient name"), max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name="ingredients")

    class Meta:
        verbose_name = _("Ingredient")
        verbose_name_plural = _("Ingredients")

    def __str__(self):
        return self.name

    def get_absolute_url(self) -> str:
        return reverse("api:ingredient-detail", kwargs={"pk": self.pk})


