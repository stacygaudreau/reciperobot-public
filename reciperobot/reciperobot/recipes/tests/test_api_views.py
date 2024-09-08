import pytest
from django.urls import reverse
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate

from reciperobot.ingredients.models import Ingredient
from reciperobot.measures.models import Measure
from reciperobot.recipes.api.serializers import RecipeIngredientSerializer
from reciperobot.recipes.api.serializers import RecipeSerializer
from reciperobot.recipes.api.serializers import RecipeStepSerializer
from reciperobot.recipes.api.views import RecipeIngredientViewSet
from reciperobot.recipes.api.views import RecipeStepViewSet
from reciperobot.recipes.api.views import RecipeViewSet
from reciperobot.recipes.models import Recipe
from reciperobot.recipes.models import RecipeIngredient
from reciperobot.recipes.models import RecipeStep
from reciperobot.users.models import User
from reciperobot.users.tests.factories import UserFactory


class TestRecipeViewSet:
    @pytest.fixture()
    def rf(self) -> APIRequestFactory:
        return APIRequestFactory()

    def test_get_queryset(self, recipe: Recipe, rf: APIRequestFactory):
        view = RecipeViewSet()
        request = rf.get("/fake-url/")
        request.recipe = recipe
        request.user = recipe.user

        view.request = request

        assert recipe in view.get_queryset()

    def test_detail(self, recipe: Recipe, rf: APIRequestFactory):
        url = reverse("api:recipe-detail", kwargs={"pk": recipe.id})
        req = rf.get(url)
        force_authenticate(req, user=recipe.user)
        view = RecipeViewSet.as_view({"get": "retrieve"})
        res = view(req, pk=recipe.id)
        assert res.status_code == 200, \
            f"expected status 200, but got {res.status_code}"
        created_date = recipe.created.strftime("%Y-%m-%d")
        print(res.data)
        assert res.data == {
            "id": recipe.id,
            "name": recipe.name,
            "description": recipe.description,
            "version": recipe.version,
            "is_public": recipe.is_public,
            "user": recipe.user.id,
            "user_username": recipe.user.username,
            "created_date": created_date,
            "url": f"http://testserver/api/recipes/{recipe.id}/",
        }

    @pytest.mark.django_db()
    def test_list_ingredients_from_recipe(self, recipe: Recipe,
                                          measure: Measure,
                                          rf: APIRequestFactory):
        """
        Multiple ingredients are added to a Recipe as RecipeIngredients,
        and are successfully retrieved with the list view by recipe ID.
        """
        # populate a recipe with ingredients
        user = recipe.user
        ingredients = Ingredient.objects.bulk_create(
            [Ingredient(name=f"Ingredient {i}", user=user) for i in range(3)])
        serialized_ingredients = []
        for i, ingredient in enumerate(ingredients):
            recipe_ingredient = RecipeIngredient.objects.create(
                recipe=recipe, ingredient=ingredient, qty_float=float(i+1.0),
                qty_numerator=i+1, qty_denominator=0, modifier=f"modifier {i}",
                order=3-i, measure=measure)
            # we cache the serialized version, for verification later
            serialized_ingredients.append(
                RecipeIngredientSerializer(recipe_ingredient).data)
        # request the ingredient list from the view
        url = reverse("api:recipe-recipe_ingredients",
                      kwargs={"pk": recipe.id})
        req = rf.get(url)
        force_authenticate(req, user=user)
        view = RecipeViewSet.as_view({"get": "recipe_ingredients"})
        res = view(req, pk=recipe.id)
        assert res.status_code == 200, \
            f"expected status 200, but got {res.status_code}"
        # validate the list is correct and returned in the right order
        # (we inserted the objects in the wrong sequence so as to validate
        # their correct queried order here)
        assert res.data[0]["order"] == 1
        assert res.data[1]["order"] == 2
        assert res.data[2]["order"] == 3
        # validate the serialized ingredients exist in the response's data
        for ri in serialized_ingredients:
            assert ri in res.data

    @pytest.mark.django_db()
    def test_list_steps_from_recipe(self, recipe: Recipe,
                                    rf: APIRequestFactory):
        """
        Multiple RecipeSteps are added to a Recipe and are
        successfully retrieved with the list view by recipe ID.
        """
        # populate a recipe with steps
        user = recipe.user
        serialized_steps = []
        for i in range(3):
            step = RecipeStep.objects.create(
                recipe=recipe, text=f"Step {i+1} text", order=3-i)
            # we cache the serialized version for verification later
            serialized_steps.append(
                RecipeStepSerializer(step).data)
        # request the step list from the view
        url = reverse("api:recipe-recipe_steps",
                    kwargs={"pk": recipe.id})
        req = rf.get(url)
        force_authenticate(req, user=user)
        view = RecipeViewSet.as_view({"get": "recipe_steps"})
        res = view(req, pk=recipe.id)
        assert res.status_code == 200, \
            f"expected status 200, but got {res.status_code}"
        # validate the list is correct and returned in the right order
        # (we inserted the objects in the wrong sequence so as to validate
        # their correct queried order here)
        assert res.data[0]["order"] == 1
        assert res.data[1]["order"] == 2
        assert res.data[2]["order"] == 3
        # validate the serialized steps exist in the response's data
        for step in serialized_steps:
            assert step in res.data

    @pytest.mark.django_db()
    def test_list_public_recipes(self, rf: APIRequestFactory,
                                 user: User):
        """
        A non-authenticated user can list recipes
        which have their is_public field set.
        """
        # a user creates 3 recipes; two of which are public
        serialized_recipes = []
        for i in range(3):
            recipe = Recipe.objects.create(
                name=f"Recipe {i+1}", description=f"Description {i+1}",
                is_public=(i != 0), user=user)
            # we cache the serialized version for verification later
            serialized_recipes.append(
                RecipeSerializer(recipe, context={"request": None}).data)
        # request the list from the view
        url = reverse("api:recipe-public")
        req = rf.get(url)
        view = RecipeViewSet.as_view({"get": "public"})
        res = view(req)
        assert res.status_code == 200, \
            f"expected status 200, but got {res.status_code}"
        # only the 2nd and 3rd recipes created are public
        # thus, the first one should be absent from the result
        assert len(res.data) == 2
        assert serialized_recipes[1]["id"] == res.data[0]["id"]
        assert serialized_recipes[2]["id"] == res.data[1]["id"]

    @pytest.mark.django_db()
    def test_list_user_recipes(self, rf: APIRequestFactory,
                               user: User):
        """
        Recipes owned by the currently authenticated user
        are tested (/api/recipes/mine endpoint)
        """
        # a user creates 2 recipes
        serialized_recipes = []
        for i in range(2):
            recipe = Recipe.objects.create(
                name=f"Recipe {i+1}", description=f"Description {i+1}",
                is_public=False, user=user)
            # we cache the serialized version for verification later
            serialized_recipes.append(
                RecipeSerializer(recipe, context={"request": None}).data)
        # a different user creates another recipe (which is public, but
        # still should not be returned by the view)
        user2 = UserFactory()
        Recipe.objects.create(
            name="Recipe by User2", description="User2's recipe",
            is_public=True, user=user2)
        serialized_recipes.append(
            RecipeSerializer(recipe, context={"request": None}).data)
        # the first user requests their recipes, and only
        # the recipes they own are returned in the view
        url = reverse("api:recipe-mine")
        req = rf.get(url)
        force_authenticate(req, user=user)
        view = RecipeViewSet.as_view({"get": "mine"})
        res = view(req)
        assert res.status_code == 200, \
            f"expected status 200, but got {res.status_code}"
        # the user's two recipes should be in the result
        assert len(res.data) == 2
        assert serialized_recipes[0]["id"] == res.data[0]["id"]
        assert serialized_recipes[1]["id"] == res.data[1]["id"]

        # hitting the endpoint without being authenticated should
        # return a 403 forbidden response
        url = reverse("api:recipe-mine")
        req = rf.get(url)
        view = RecipeViewSet.as_view({"get": "mine"})
        res = view(req)
        assert res.status_code == 403, \
            f"expected status 403, but got {res.status_code}"


class TestRecipeIngredientViewSet:
    @pytest.fixture()
    def rf(self) -> APIRequestFactory:
        return APIRequestFactory()

    def test_get_queryset(self, recipe_ingredient: RecipeIngredient,
                          rf: APIRequestFactory):
        view = RecipeIngredientViewSet()
        request = rf.get("/fake-url/")
        request.recipe_ingredient = recipe_ingredient
        request.user = recipe_ingredient.recipe.user

        view.request = request

        assert recipe_ingredient in view.get_queryset()

    def test_detail(self, recipe_ingredient: RecipeIngredient,
                    rf: APIRequestFactory):
        url = reverse("api:recipe_ingredient-detail",
                      kwargs={"pk": recipe_ingredient.id})
        req = rf.get(url)
        force_authenticate(req, user=recipe_ingredient.recipe.user)
        view = RecipeIngredientViewSet.as_view({"get": "retrieve"})
        res = view(req, pk=recipe_ingredient.id)
        assert res.status_code == 200, \
            f"expected status 200, but got {res.status_code}"
        qty_f = f"{recipe_ingredient.qty_float:.2f}"
        assert res.data == {
            "id": recipe_ingredient.id,
            "order": recipe_ingredient.order,
            "measure": recipe_ingredient.measure.id,
            "measure_name": recipe_ingredient.measure.name,
            "qty_float": qty_f,
            "qty_numerator": recipe_ingredient.qty_numerator,
            "qty_denominator": recipe_ingredient.qty_denominator,
            "modifier": recipe_ingredient.modifier,
            "ingredient": recipe_ingredient.ingredient.id,
            "ingredient_name": recipe_ingredient.ingredient.name,
            "recipe": recipe_ingredient.recipe.id,
        }


class TestRecipeStepsViewSet:
    @pytest.fixture()
    def rf(self) -> APIRequestFactory:
        return APIRequestFactory()

    def test_get_queryset(self, recipe_step: RecipeStep,
                          rf: APIRequestFactory):
        view = RecipeStepViewSet()
        request = rf.get("/fake-url/")
        request.recipe_step = recipe_step
        request.user = recipe_step.recipe.user

        view.request = request

        assert recipe_step in view.get_queryset()

    def test_detail(self, recipe_step: RecipeStep,
                    rf: APIRequestFactory):
        url = reverse("api:recipe_step-detail",
                      kwargs={"pk": recipe_step.id})
        req = rf.get(url)
        force_authenticate(req, user=recipe_step.recipe.user)
        view = RecipeStepViewSet.as_view({"get": "retrieve"})
        res = view(req, pk=recipe_step.id)
        assert res.status_code == 200, \
            f"expected status 200, but got {res.status_code}"
        assert res.data == {
            "id": recipe_step.id,
            "order": recipe_step.order,
            "recipe": recipe_step.recipe.id,
            "text": recipe_step.text,
        }
