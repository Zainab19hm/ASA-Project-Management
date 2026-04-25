"""Analyze app API views."""

from __future__ import annotations

import time

from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.exceptions import UpstreamServiceError

from .serializers import ScopeInputSerializer
from .services.ai_client import analyze_parallel, call_gantt_model, call_risk_model, call_wbs_model
from .services.export_service import (
    build_gantt_pdf,
    build_gantt_png,
    build_risk_pdf,
    build_risk_png,
    build_wbs_pdf,
    build_wbs_png,
)

MAX_ANALYZE_RETRIES = 3
RETRY_BACKOFF_SECONDS = 1


def _export_file(request, builder, filename: str, content_type: str):
    if not isinstance(request.data, dict):
        return Response(
            {"detail": "Request body must be a JSON object."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    file_bytes = builder(request.data)
    response = HttpResponse(file_bytes, content_type=content_type)
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response


class AnalyzeView(APIView):
    """Generate WBS, Gantt, and Risk in a contract-safe response."""

    def post(self, request):
        serializer = ScopeInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        scope_text = serializer.validated_data["scope_text"]
        last_error: Exception | None = None

        for attempt in range(1, MAX_ANALYZE_RETRIES + 1):
            try:
                result = analyze_parallel(scope_text)
                return Response(result, status=status.HTTP_200_OK)
            except UpstreamServiceError as exc:
                last_error = exc
            except Exception as exc:
                last_error = exc

            if attempt < MAX_ANALYZE_RETRIES:
                time.sleep(RETRY_BACKOFF_SECONDS * attempt)

        raise UpstreamServiceError(
            detail="AI service is temporarily unavailable after 3 attempts. Please try again shortly."
        ) from last_error


class AnalyzeAllView(AnalyzeView):
    """Backward-compatible alias for the previous class name."""


class AnalyzeWBSView(APIView):
    def post(self, request):
        serializer = ScopeInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = call_wbs_model(serializer.validated_data["scope_text"])
        return Response(result, status=status.HTTP_200_OK)


class AnalyzeGanttView(APIView):
    def post(self, request):
        serializer = ScopeInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = call_gantt_model(serializer.validated_data["scope_text"])
        return Response(result, status=status.HTTP_200_OK)


class AnalyzeRiskView(APIView):
    def post(self, request):
        serializer = ScopeInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = call_risk_model(serializer.validated_data["scope_text"])
        return Response(result, status=status.HTTP_200_OK)


class ExportWBSPDFView(APIView):
    def post(self, request):
        return _export_file(request, build_wbs_pdf, "wbs.pdf", "application/pdf")


class ExportGanttPDFView(APIView):
    def post(self, request):
        return _export_file(request, build_gantt_pdf, "gantt.pdf", "application/pdf")


class ExportRiskPDFView(APIView):
    def post(self, request):
        return _export_file(request, build_risk_pdf, "risk-log.pdf", "application/pdf")


class ExportWBSPNGView(APIView):
    def post(self, request):
        return _export_file(request, build_wbs_png, "wbs.png", "image/png")


class ExportGanttPNGView(APIView):
    def post(self, request):
        return _export_file(request, build_gantt_png, "gantt.png", "image/png")


class ExportRiskPNGView(APIView):
    def post(self, request):
        return _export_file(request, build_risk_png, "risk-log.png", "image/png")
