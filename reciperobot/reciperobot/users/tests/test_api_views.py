import pytest
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate
from django.urls import reverse

from reciperobot.users.api.views import UserViewSet, SetComposerRecipeView
from reciperobot.users.models import User
from reciperobot.recipes.models import Recipe


class TestUserViewSet:
    @pytest.fixture()
    def api_rf(self) -> APIRequestFactory:
        return APIRequestFactory()

    def test_get_queryset(self, user: User, api_rf: APIRequestFactory):
        view = UserViewSet()
        request = api_rf.get("/fake-url/")
        request.user = user

        view.request = request

        assert user in view.get_queryset()

    def test_me(self, user: User, api_rf: APIRequestFactory):
        view = UserViewSet()
        request = api_rf.get("/fake-url/")
        request.user = user

        view.request = request

        response = view.me(request)  # type: ignore[call-arg, arg-type, misc]

        assert response.data == {
            "username": user.username,
            "composer_recipe": user.composer_recipe,
            "url": f"http://testserver/api/users/{user.username}/",
            "name": user.name,
        }

class TestUserSettings:
    @pytest.fixture()
    def api_rf(self) -> APIRequestFactory:
        return APIRequestFactory()

    def test_set_composer_recipe(self, user: User, rf: APIRequestFactory,
                                 recipe: Recipe):
        user = recipe.user
        # set up POST request for endpoint
        url = reverse("set-composer-recipe")
        req = rf.post(url, {"recipe_id": recipe.id}, format="json")
        force_authenticate(req, user=user)
        view = SetComposerRecipeView.as_view()
        res = view(req)
        assert res.status_code == 200, \
            f"expected status 200, but got {res.status_code}"
        assert res.data["id"] == recipe.id, \
            f"expected recipe ID {recipe.id}, but got {res.data['id']}"
        assert user.composer_recipe == recipe, \
            f"expected user.composer_recipe to be {recipe},\
                but got {user.composer_recipe}"

