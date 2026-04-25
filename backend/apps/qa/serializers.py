from rest_framework import serializers


class QAInputSerializer(serializers.Serializer):
    question = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True,
        max_length=10000,
    )
