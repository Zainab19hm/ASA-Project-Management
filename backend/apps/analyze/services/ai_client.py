"""HTTP client for AI analyze endpoints with pooled connections."""

from __future__ import annotations

import os
from concurrent.futures import ThreadPoolExecutor

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from core.exceptions import UpstreamServiceError


AI_SERVICE_BASE_URL = os.getenv("AI_SERVICE_BASE_URL", "http://127.0.0.1:8001").rstrip("/")
AI_CONNECT_TIMEOUT = float(os.getenv("AI_CONNECT_TIMEOUT", "3"))
AI_READ_TIMEOUT = float(os.getenv("AI_READ_TIMEOUT", "90"))
ANALYZE_PARALLEL_WORKERS = int(os.getenv("ANALYZE_PARALLEL_WORKERS", "3"))

_retry = Retry(
    total=2,
    backoff_factor=0.2,
    status_forcelist=(429, 500, 502, 503, 504),
    allowed_methods=frozenset(["POST"]),
)
_adapter = HTTPAdapter(pool_connections=20, pool_maxsize=20, max_retries=_retry)
_session = requests.Session()
_session.mount("http://", _adapter)
_session.mount("https://", _adapter)

_executor = ThreadPoolExecutor(max_workers=ANALYZE_PARALLEL_WORKERS)


def _post_json(endpoint: str, payload: dict) -> dict:
    url = f"{AI_SERVICE_BASE_URL}{endpoint}"

    try:
        response = _session.post(
            url,
            json=payload,
            timeout=(AI_CONNECT_TIMEOUT, AI_READ_TIMEOUT),
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise UpstreamServiceError(
            detail=f"Failed to call AI service endpoint '{endpoint}'."
        ) from exc

    try:
        body = response.json()
    except ValueError as exc:
        raise UpstreamServiceError(
            detail=f"AI service returned invalid JSON for '{endpoint}'."
        ) from exc

    if not isinstance(body, dict):
        raise UpstreamServiceError(
            detail=f"AI service returned unexpected payload for '{endpoint}'."
        )

    return body


def call_wbs_model(scope_text: str) -> dict:
    return _post_json("/wbs", {"scope_text": scope_text})


def call_gantt_model(scope_text: str) -> dict:
    return _post_json("/gantt", {"scope_text": scope_text})


def call_risk_model(scope_text: str) -> dict:
    return _post_json("/risk", {"scope_text": scope_text})


def analyze_parallel(scope_text: str) -> dict:
    """Run WBS, Gantt, and Risk generation in parallel for faster responses."""
    futures = {
        "wbs": _executor.submit(call_wbs_model, scope_text),
        "gantt": _executor.submit(call_gantt_model, scope_text),
        "risk": _executor.submit(call_risk_model, scope_text),
    }
    return {name: future.result() for name, future in futures.items()}
