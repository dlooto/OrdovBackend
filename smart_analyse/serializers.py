from rest_framework import serializers

from .models import ExpectArea, PostCandidateMatchScore

class ExpectAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpectArea
        fields = (
            'resume',
            'area',
        )

class PostCandidateMatchScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostCandidateMatchScore
        fields = (
            'id',
            'resume',
            'post',
            'last_modified',
            'created',
        )
