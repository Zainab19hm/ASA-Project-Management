# ADD to backend/apps/analyze/views.py (after existing imports)
from django.http import HttpResponse
from .services.export_service import build_wbs_pdf, build_gantt_pdf, build_risk_pdf
import json


def export_wbs_pdf(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    data = json.loads(request.body)
    pdf_bytes = build_wbs_pdf(data)
    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="wbs.pdf"'
    return response


def export_gantt_pdf(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    data = json.loads(request.body)
    pdf_bytes = build_gantt_pdf(data)
    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="gantt.pdf"'
    return response


def export_risk_pdf(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    data = json.loads(request.body)
    pdf_bytes = build_risk_pdf(data)
    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="risks.pdf"'
    return response