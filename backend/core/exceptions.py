from typing import Any

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler


class ServiceAPIException(APIException):
	status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
	default_detail = "Unexpected service error."
	default_code = "service_error"

	def __init__(
		self,
		detail: str | dict[str, Any] | None = None,
		code: str | None = None,
		*,
		status_code: int | None = None,
		extra: dict[str, Any] | None = None,
	) -> None:
		if status_code is not None:
			self.status_code = status_code
		self.extra = extra or {}
		super().__init__(detail=detail, code=code)


class AIServiceError(ServiceAPIException):
	status_code = status.HTTP_502_BAD_GATEWAY
	default_detail = "Failed to process request with AI service."
	default_code = "ai_service_error"


def custom_exception_handler(exc: Exception, context: dict[str, Any]) -> Response | None:
	response = exception_handler(exc, context)
	if response is None:
		return Response(
			{
				"success": False,
				"error": {
					"code": "internal_server_error",
					"message": "An unexpected error occurred.",
				},
			},
			status=status.HTTP_500_INTERNAL_SERVER_ERROR,
		)

	code = "error"
	message: str | dict[str, Any] = response.data
	extra: dict[str, Any] = {}

	if isinstance(exc, ServiceAPIException):
		code = exc.default_code
		message = exc.detail
		extra = exc.extra
	elif hasattr(exc, "default_code"):
		code = str(getattr(exc, "default_code"))

	payload = {
		"success": False,
		"error": {
			"code": code,
			"message": message,
		},
	}
	if extra:
		payload["error"]["extra"] = extra

	response.data = payload
	return response
