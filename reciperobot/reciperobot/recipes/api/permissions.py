from rest_framework.permissions import SAFE_METHODS
from rest_framework.permissions import BasePermission


class ReadOnlyWhenOwnerMakesPublic(BasePermission):
    """
    By default, model objects are accessible only by their owners.
    This permission allows the owner to set the is_public flag on an
    object to allow non-authenticated users to view the object.
    """
    def has_object_permission(self, request, view, obj):
        # reading can be done by anyone when the object is public
        if obj.is_public and request.method in SAFE_METHODS:
            return True

        # RW for the owner only
        return obj.user == request.user
