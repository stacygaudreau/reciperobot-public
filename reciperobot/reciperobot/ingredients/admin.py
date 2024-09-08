from django.contrib import admin
from reciperobot.ingredients.models import Ingredient

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    pass
    

