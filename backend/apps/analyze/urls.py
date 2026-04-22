# Add to backend/apps/analyze/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # ... existing patterns ...
    path("export/wbs-pdf/",   views.export_wbs_pdf,   name="export-wbs-pdf"),
    path("export/gantt-pdf/", views.export_gantt_pdf, name="export-gantt-pdf"),
    path("export/risk-pdf/",  views.export_risk_pdf,  name="export-risk-pdf"),
]