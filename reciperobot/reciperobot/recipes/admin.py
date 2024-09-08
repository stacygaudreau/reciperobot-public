from django.contrib import admin

from reciperobot.recipes.models import Recipe, RecipeIngredient, RecipeStep

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    pass

@admin.register(RecipeIngredient)
class RecipeIngredientAdmin(admin.ModelAdmin):
    pass

@admin.register(RecipeStep)
class RecipeStepAdmin(admin.ModelAdmin):
    pass

