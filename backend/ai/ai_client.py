"""Contract-safe AI scope analysis service."""

from __future__ import annotations

from typing import Any

from apps.analyze.services.ai_client import (
    call_gantt_model,
    call_risk_model,
    call_wbs_model,
)


def _dict_list(value: Any) -> list[dict]:
    if not isinstance(value, list):
        return []
    return [item for item in value if isinstance(item, dict)]


def _normalize_wbs(payload: Any) -> list[dict]:
    if isinstance(payload, list):
        return _dict_list(payload)

    if isinstance(payload, dict):
        return _dict_list(payload.get("phases"))

    return []


def _normalize_gantt(payload: Any) -> dict:
    if not isinstance(payload, dict):
        return {"tasks": []}

    tasks = _dict_list(payload.get("tasks"))
    normalized = dict(payload)
    normalized["tasks"] = tasks
    return normalized


def _normalize_risks(payload: Any) -> list[dict]:
    if isinstance(payload, list):
        return _dict_list(payload)

    if isinstance(payload, dict):
        return _dict_list(payload.get("risks"))

    return []


def analyze_scope(scope_text: str) -> dict:
    """Generate scope outputs and enforce the frontend JSON contract."""
    wbs_payload = call_wbs_model(scope_text)
    gantt_payload = call_gantt_model(scope_text)
    risk_payload = call_risk_model(scope_text)

    return {
        "wbs": _normalize_wbs(wbs_payload),
        "gantt": _normalize_gantt(gantt_payload),
        "risks": _normalize_risks(risk_payload),
    }

