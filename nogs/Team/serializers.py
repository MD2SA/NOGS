from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, TeamMembership, TeamMessage


class TeamSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ['created_at']

    def get_members(self, obj):
        return [
            {"id": membership.user.id, "username": membership.user.username}
            for membership in obj.teammembership_set.all()
        ]


class TeamMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMembership
        fields = '__all__'
        read_only_fields = ['joined_at']

class TeamMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    class Meta:
        model= TeamMessage
        fields = '__all__'
        read_only_fields = ['sender', 'team', 'created_at']