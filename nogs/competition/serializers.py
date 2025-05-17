from rest_framework import serializers
from .models import Competition, CompetitionParticipant


class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = '__all__'
        read_only_fields = ['created_on', 'participants']

    def create(self, validated_data):
        validated_data.setdefault('created_by', self.context['request'].user)
        return super().create(validated_data)


class CompetitionParticipantSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)  # Nome de usuário

    class Meta:
        model = CompetitionParticipant
        fields = ['user', 'username', 'competition', 'wpm', 'accuracy', 'tries','position']