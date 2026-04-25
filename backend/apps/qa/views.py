"""QA app API views."""

from __future__ import annotations

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import QAInputSerializer
from .services.ai_client import call_qa_model


class QAView(APIView):
    def post(self, request):
        serializer = QAInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = call_qa_model(serializer.validated_data["question"])
        if isinstance(result, dict):
            return Response(result, status=status.HTTP_200_OK)

        return Response({"answer": str(result)}, status=status.HTTP_200_OK)
