from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, TeamMembership

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'
