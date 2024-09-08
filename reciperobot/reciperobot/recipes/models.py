from django.db import models
from django_extensions.db.models import TimeStampedModel
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

from reciperobot.ingredients.models import Ingredient
from reciperobot.measures.models import Measure

User = get_user_model()

class Recipe(TimeStampedModel, models.Model):
    """
    Represents a single food recipe.
    """
    name = models.CharField(_("Recipe name"), max_length=100)
    description = models.TextField(_("Recipe description/notes"), max_length=500,
                                   blank=True)
    version = models.IntegerField(_("Recipe version number"), default=1, editable=True,
                                  blank=True)
    is_public = models.BooleanField(_("Public visibility"), default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name="recipes")

    class Meta:
        verbose_name = _("Recipe")
        verbose_name_plural = _("Recipes")

    def __str__(self):
        return self.name

    def get_absolute_url(self) -> str:
        return reverse("api:recipe-detail", kwargs={"pk": self.pk})


class RecipeIngredient(TimeStampedModel, models.Model):
    """
    An ingredient which is used in a Recipe
    """
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE,
                               related_name="recipe_ingredients")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE,
                                   related_name="recipe_ingredients")
    measure = models.ForeignKey(Measure, on_delete=models.SET_NULL,
                                null=True, blank=False)
    qty_float = models.DecimalField(max_digits=6, decimal_places=2,
                                    blank=True, default=0.0)
    qty_numerator = models.IntegerField(blank=True, default=0)
    qty_denominator = models.IntegerField(blank=True, default=0)
    modifier = models.CharField(
        _("Ingredient preparation note/modifier, eg: 'diced'"),
        blank=True, max_length=50)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _("RecipeIngredient")
        verbose_name_plural = _("RecipeIngredients")

    def __str__(self):
        return f"({self.recipe.name}): {self.order+1}. {self.ingredient.name}"

    def get_absolute_url(self) -> str:
        return reverse("api:recipe_ingredient-detail", kwargs={"pk": self.pk})


class RecipeStep(TimeStampedModel, models.Model):
    """
    Preparation step/direction in a recipe's instructions.
    """
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE,
                               related_name="recipe_steps")
    text = models.TextField(_("Preparation step text contents"), max_length=300)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _("RecipeStep")
        verbose_name_plural = _("RecipeSteps")

    def __str__(self):
        return f"({self.recipe.name[0:10]}): {self.order+1}. {self.text[0:10]}"

    def get_absolute_url(self) -> str:
        return reverse("api:recipe_step-detail", kwargs={"pk": self.pk})
