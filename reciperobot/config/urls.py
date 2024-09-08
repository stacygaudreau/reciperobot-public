# ruff: noqa
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include
from django.urls import path
from django.views import defaults as default_views
from drf_spectacular.views import SpectacularAPIView
from drf_spectacular.views import SpectacularSwaggerView
from rest_framework.authtoken.views import obtain_auth_token
from reciperobot.users.api.views import SetComposerRecipeView, csrf_token_view

urlpatterns = [
    # Django Admin, use {% url 'admin:index' %}
    path(settings.ADMIN_URL, admin.site.urls),
    # reciperobot application views
    # ...
    # Media files
    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
]

# API URLS
urlpatterns += [
    # API base url
    path("api/", include("config.api_router")),
    # singleton api views
    path("api/set_composer_recipe", SetComposerRecipeView.as_view(),
         name="set-composer-recipe"),
    path("api/csrf-token/", csrf_token_view, name="csrf-token"),
    # DRF auth
    path("api/auth-token/", obtain_auth_token),
    path("api/auth/", include('dj_rest_auth.urls')),
    path("api/auth/registration/", include('dj_rest_auth.registration.urls')),
    # schema and API docs
    path("api/schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path("api/docs/",
        SpectacularSwaggerView.as_view(url_name="api-schema"),
        name="api-docs",
    ),
]

if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),
        path(
            "404/",
            default_views.page_not_found,
            kwargs={"exception": Exception("Page not Found")},
        ),
        path("500/", default_views.server_error),
    ]
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
