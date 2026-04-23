"""Custom API exceptions and exception handler for DRF."""

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler


class UpstreamServiceError(APIException):
    """Raised when an upstream AI service is unavailable or invalid."""

    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = "Upstream AI service unavailable."
    default_code = "upstream_service_unavailable"


def custom_exception_handler(exc, context):
    """Normalize unhandled exceptions into predictable API responses."""
    response = exception_handler(exc, context)
    if response is not None:
        return response

    if isinstance(exc, ValueError):
        return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(
        {"detail": "Internal server error."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
