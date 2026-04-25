from rest_framework import serializers


class ScopeInputSerializer(serializers.Serializer):
    scope_text = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True,
        min_length=200,
        max_length=50000,
        error_messages={
            "min_length": "scope_text must be at least 200 characters.",
        },
    )
