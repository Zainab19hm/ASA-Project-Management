import json
import re
from typing import Any

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import AnalyzeResponseSerializer, AnalyzeTextSerializer
from .services.ai_client import AIClient


def _try_parse_json_string(value: str) -> Any:
	text = value.strip()
	if not text:
		return value

	# Parse direct JSON strings or JSON embedded in markdown code blocks.
	try:
		return json.loads(text)
	except json.JSONDecodeError:
		pass

	block_match = re.search(r"```(?:json)?\s*(\{.*?\}|\[.*?\])\s*```", text, re.DOTALL)
	if block_match:
		try:
			return json.loads(block_match.group(1))
		except json.JSONDecodeError:
			return value

	inline_match = re.search(r"(\{.*\}|\[.*\])", text, re.DOTALL)
	if inline_match:
		try:
			return json.loads(inline_match.group(1))
		except json.JSONDecodeError:
			return value

	return value


def parse_ai_response(data: dict[str, Any]) -> Any:
	# Normalize common response structures and parse JSON-like strings.
	for key in ("result", "output", "response", "data"):
		if key in data:
			value = data[key]
			if isinstance(value, str):
				return _try_parse_json_string(value)
			return value
	return data


class AnalyzeBaseView(APIView):
	action: str = ""
	endpoint_name: str = ""

	def post(self, request: Request) -> Response:
		serializer = AnalyzeTextSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		text = serializer.validated_data["text"]
		ai_client = AIClient()
		raw_result = ai_client.call(self.action, text)
		parsed_result = parse_ai_response(raw_result)

		payload = {
			"success": True,
			"endpoint": self.endpoint_name,
			"raw": raw_result,
			"parsed": parsed_result,
		}
		response_serializer = AnalyzeResponseSerializer(data=payload)
		response_serializer.is_valid(raise_exception=True)
		return Response(response_serializer.data, status=status.HTTP_200_OK)


class AnalyzeScopeView(AnalyzeBaseView):
	action = "analyze_scope"
	endpoint_name = "analyze-scope"


class GenerateWBSView(AnalyzeBaseView):
	action = "generate_wbs"
	endpoint_name = "generate-wbs"


class GenerateGanttView(AnalyzeBaseView):
	action = "generate_gantt"
	endpoint_name = "generate-gantt"


class AnalyzeRisksView(AnalyzeBaseView):
	action = "analyze_risks"
	endpoint_name = "analyze-risks"
