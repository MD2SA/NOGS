from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Result, UserStats


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'
        read_only_fields = ['user'] # impede que cliente passe user

class UserStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStats
        fields = '__all__'
