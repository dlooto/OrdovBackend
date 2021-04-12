from rest_framework import serializers
from .models import Candidate

class CandidateSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    def get_id(self, candidate):
        return candidate.id

    class Meta:
        model = Candidate
        fields = (
            'id',
            'user',
        )
