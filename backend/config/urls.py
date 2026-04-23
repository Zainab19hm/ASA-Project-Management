"""URL configuration for backend project."""

from django.http import JsonResponse
from django.urls import include, path


def healthcheck(_request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("health/", healthcheck, name="healthcheck"),
    path("api/analyze/", include("apps.analyze.urls")),
    path("api/qa/", include("apps.qa.urls")),
]
