from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Result, Game


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'


class ResultSerializer(serializers.Serializer):

    fields = ['user', 'game', 'accuracy',
              'played_date', 'wpm', 'time']
