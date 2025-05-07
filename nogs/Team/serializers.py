from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, TeamMembership

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ['created_at']

        def create(self, validated_data):
            validated_data.setdefault('created_by', self.context['request'].user)
            return super().create(validated_data)


class TeamMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMembership
        fields = '__all__'
        read_only_fields = ['joined_at']

