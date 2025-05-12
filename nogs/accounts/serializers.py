from rest_framework import serializers
from django.contrib.auth.models import User

from Team.models import TeamMembership

from type.models import UserStats


class UserSerializer(serializers.ModelSerializer):
    best_wpm = serializers.FloatField(source='userstats.best_wpm', read_only=True)
    avg_wpm = serializers.FloatField(source='userstats.avg_wpm', read_only=True)
    avg_accuracy = serializers.FloatField(source='userstats.avg_accuracy', read_only=True)
    total_games = serializers.IntegerField(source='userstats.total_games', read_only=True)
    total_time_played = serializers.IntegerField(source='userstats.total_time_played', read_only=True)
    team = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'date_joined', 'team',
                  'is_staff','best_wpm','avg_wpm', 'avg_accuracy',
                  'total_games','total_time_played',
                  ]
        read_only_fields = fields

    def get_team(self,obj):
        try:
            membership = TeamMembership.objects.get(user=obj)
            return membership.team.name
        except  TeamMembership.DoesNotExist:
            return None