from rest_framework import serializers


class AnalyzeTextSerializer(serializers.Serializer):
	text = serializers.CharField(allow_blank=False, trim_whitespace=True)


class AnalyzeResponseSerializer(serializers.Serializer):
	success = serializers.BooleanField(default=True)
	endpoint = serializers.CharField()
	raw = serializers.JSONField()
	parsed = serializers.JSONField()
