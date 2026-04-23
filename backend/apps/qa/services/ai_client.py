"""HTTP client for AI QA endpoint."""

from __future__ import annotations

import os

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from core.exceptions import UpstreamServiceError


AI_SERVICE_BASE_URL = os.getenv("AI_SERVICE_BASE_URL", "http://127.0.0.1:8001").rstrip("/")
AI_CONNECT_TIMEOUT = float(os.getenv("AI_CONNECT_TIMEOUT", "3"))
AI_READ_TIMEOUT = float(os.getenv("AI_READ_TIMEOUT", "90"))

_retry = Retry(
    total=2,
    backoff_factor=0.2,
    status_forcelist=(429, 500, 502, 503, 504),
    allowed_methods=frozenset(["POST"]),
)
_adapter = HTTPAdapter(pool_connections=10, pool_maxsize=10, max_retries=_retry)
_session = requests.Session()
_session.mount("http://", _adapter)
_session.mount("https://", _adapter)


def call_qa_model(question: str):
    url = f"{AI_SERVICE_BASE_URL}/qa"

    try:
        response = _session.post(
            url,
            json={"question": question},
            timeout=(AI_CONNECT_TIMEOUT, AI_READ_TIMEOUT),
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise UpstreamServiceError(detail="Failed to call AI QA endpoint.") from exc

    try:
        return response.json()
    except ValueError as exc:
        raise UpstreamServiceError(detail="AI QA endpoint returned invalid JSON.") from exc
