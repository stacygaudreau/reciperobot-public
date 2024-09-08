from django.urls import resolve
from django.urls import reverse

from reciperobot.users.models import User
from reciperobot.users.api.views import SetComposerRecipeView


def test_user_detail(user: User):
    assert (
        reverse("api:user-detail", kwargs={"username": user.username})
        == f"/api/users/{user.username}/"
    )
    assert resolve(f"/api/users/{user.username}/").view_name == "api:user-detail"


def test_user_list():
    assert reverse("api:user-list") == "/api/users/"
    assert resolve("/api/users/").view_name == "api:user-list"


def test_user_me():
    assert reverse("api:user-me") == "/api/users/me/"
    assert resolve("/api/users/me/").view_name == "api:user-me"

def test_set_composer_recipe():
    url = reverse("set-composer-recipe")
    assert url == "/api/set_composer_recipe"
    res = resolve(url)
    assert res.view_name == "set-composer-recipe"
    assert res.func.view_class == SetComposerRecipeView
