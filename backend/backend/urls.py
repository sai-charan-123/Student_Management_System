"""URL configuration for the UniAdmit Django backend and React SPA."""

from pathlib import Path

from django.conf import settings
from django.contrib import admin
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import include, path, re_path


def api_root_view(request):
    return JsonResponse(
        {
            "service": "UniAdmit - College Admissions System REST API",
            "status": "online",
            "version": "1.0.0",
            "endpoints": {
                "colleges": "/api/colleges/",
                "courses": "/api/courses/",
                "applications": "/api/applications/",
                "check_eligibility": "/api/colleges/check_eligibility/?marks=80",
                "track_application": "/api/applications/track/?query=APP-XXXXX",
                "dashboard_stats": "/api/dashboard/stats/",
                "admin": "/admin/",
            },
        }
    )


def frontend_view(request, path=""):
    """Serve the Vite-built React SPA for all non-API/non-admin routes."""
    index_file = Path(settings.FRONTEND_DIST) / "index.html"
    if not index_file.exists():
        return JsonResponse(
            {"error": "Frontend build not found. Run `npm run build` first."},
            status=500,
        )
    return render(request, "index.html")


urlpatterns = [
    path("api/", api_root_view, name="api-root"),
    path("api/", include("admissions.urls")),
    path("admin/", admin.site.urls),
    path("", frontend_view, name="frontend-root"),
    re_path(r"^(?!api(?:/|$)|admin(?:/|$)|static(?:/|$)).*$", frontend_view),
]
