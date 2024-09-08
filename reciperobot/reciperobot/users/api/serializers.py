from rest_framework import serializers

from reciperobot.users.models import User


class UserSerializer(serializers.ModelSerializer[User]):
    class Meta:
        model = User
        fields = ["username", "composer_recipe", "name", "url"]

        extra_kwargs = {
            "url": {"view_name": "api:user-detail", "lookup_field": "username"},
        }



class SetComposerRecipeSerializer(serializers.Serializer):
    recipe_id = serializers.IntegerField()