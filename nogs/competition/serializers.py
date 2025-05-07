from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Competition, CompetitionParticipant
from ..type.models import Game
from ..type.serializers import GameSerializer


class CompetitionSerializer(serializers.ModelSerializer):
    game = serializers.PrimaryKeyRelatedField(queryset=Game.objects.all())
    class Meta:
        model = Competition
        fields = '__all__'
        read_only_fields = ['created_on', 'participants']

    def create(self, validated_data):
        validated_data.setdefault('created_by', self.context['request'].user)
        return super().create(validated_data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['game'] = GameSerializer(instance.game).data
        return ret


class CompetitionParticipantSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)  # ID do usuário
    username = serializers.CharField(source='user.username', read_only=True)  # Nome de usuário

    class Meta:
        model = CompetitionParticipant
        fields = ['user_id', 'username', 'competition', 'wpm', 'accuracy', 'tries_left']