import json
from typing import Any

import httpx
from django.conf import settings

from core.exceptions import AIServiceError


class AIClient:
	def __init__(self) -> None:
		self.base_url = str(settings.AI_BASE_URL).rstrip("/")
		self.timeout = float(settings.AI_TIMEOUT_SECONDS)
		self.api_key = str(settings.AI_API_KEY or "")
		self.endpoints = dict(settings.AI_ENDPOINTS)

	def call(self, action: str, text: str) -> dict[str, Any]:
		endpoint = self.endpoints.get(action)
		if not endpoint:
			raise AIServiceError(
				detail=f"Unsupported AI action: {action}",
				code="unsupported_action",
				status_code=400,
			)

		url = f"{self.base_url}{endpoint}"
		headers = {"Content-Type": "application/json"}
		if self.api_key:
			headers["Authorization"] = f"Bearer {self.api_key}"

		payload = {"text": text}
		try:
			with httpx.Client(timeout=self.timeout) as client:
				response = client.post(url, json=payload, headers=headers)
			response.raise_for_status()
			data = response.json()
		except httpx.TimeoutException as exc:
			raise AIServiceError(
				detail="AI service timed out.",
				code="ai_timeout",
				status_code=504,
				extra={"action": action, "url": url},
			) from exc
		except httpx.HTTPStatusError as exc:
			raise AIServiceError(
				detail="AI service returned an unsuccessful status code.",
				code="ai_http_error",
				status_code=502,
				extra={
					"action": action,
					"url": url,
					"status_code": exc.response.status_code,
				},
			) from exc
		except (json.JSONDecodeError, ValueError) as exc:
			raise AIServiceError(
				detail="AI service returned invalid JSON.",
				code="ai_invalid_json",
				status_code=502,
				extra={"action": action, "url": url},
			) from exc
		except httpx.HTTPError as exc:
			raise AIServiceError(
				detail="Could not connect to AI service.",
				code="ai_connection_error",
				status_code=502,
				extra={"action": action, "url": url},
			) from exc

		if not isinstance(data, dict):
			raise AIServiceError(
				detail="AI service response must be a JSON object.",
				code="ai_unexpected_payload",
				status_code=502,
				extra={"action": action, "url": url},
			)

		return data
