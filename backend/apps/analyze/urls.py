"""Analyze app URL routes."""

from django.urls import path

from . import views


urlpatterns = [
    path("", views.AnalyzeView.as_view(), name="analyze"),
    path("wbs/", views.AnalyzeWBSView.as_view(), name="analyze-wbs"),
    path("gantt/", views.AnalyzeGanttView.as_view(), name="analyze-gantt"),
    path("risk/", views.AnalyzeRiskView.as_view(), name="analyze-risk"),
    path("export/wbs-pdf/", views.ExportWBSPDFView.as_view(), name="export-wbs-pdf"),
    path("export/gantt-pdf/", views.ExportGanttPDFView.as_view(), name="export-gantt-pdf"),
    path("export/risk-pdf/", views.ExportRiskPDFView.as_view(), name="export-risk-pdf"),
    path("export/wbs-png/", views.ExportWBSPNGView.as_view(), name="export-wbs-png"),
    path("export/gantt-png/", views.ExportGanttPNGView.as_view(), name="export-gantt-png"),
    path("export/risk-png/", views.ExportRiskPNGView.as_view(), name="export-risk-png"),
]
