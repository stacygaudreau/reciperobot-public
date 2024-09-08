from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework.routers import SimpleRouter

from reciperobot.users.api.views import UserViewSet
from reciperobot.ingredients.api.views import IngredientViewSet
from reciperobot.recipes.api.views import RecipeViewSet, RecipeIngredientViewSet, RecipeStepViewSet
from reciperobot.measures.api.views import MeasureViewSet, MeasureAliasViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()

router.register("users", UserViewSet,
                basename="user")
router.register("ingredients", IngredientViewSet,
                basename="ingredient")
router.register("recipes", RecipeViewSet,
                basename="recipe")
router.register("measures", MeasureViewSet,
                basename="measure")
router.register("measure_aliases", MeasureAliasViewSet,
                basename="measure_alias")
router.register("recipe_ingredients", RecipeIngredientViewSet,
                basename="recipe_ingredient")
router.register("recipe_steps", RecipeStepViewSet,
                basename="recipe_step")

app_name = "api"
urlpatterns = router.urls
