import pytest
from rest_framework.test import APIRequestFactory, force_authenticate
from django.urls import reverse

from reciperobot.ingredients.api.views import IngredientViewSet
from reciperobot.ingredients.models import Ingredient
from reciperobot.users.models import User


class TestIngredientViewSet:
    @pytest.fixture()
    def rf(self) -> APIRequestFactory:
        return APIRequestFactory()

    def test_get_queryset(self, ingredient: Ingredient, 
                          rf: APIRequestFactory):
        view = IngredientViewSet()
        request = rf.get("/fake-url/")
        request.ingredient = ingredient
        request.user = ingredient.user

        view.request = request

        assert ingredient in view.get_queryset()

    def test_detail_view(self, ingredient: Ingredient,
                         rf: APIRequestFactory):
        url = reverse("api:ingredient-detail", kwargs={"pk": ingredient.id})
        req = rf.get(url)
        force_authenticate(req, user=ingredient.user)
        view = IngredientViewSet.as_view({"get": "retrieve"})
        res = view(req, pk=ingredient.id)
        assert res.status_code == 200, \
            f"expected status 200, but got {res.status_code}"
        assert res.data == {
            "id": ingredient.id,
            "name": ingredient.name,
            "url": f"http://testserver/api/ingredients/{ingredient.id}/",
        }
