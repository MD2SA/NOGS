from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FriendRequest,Message

class PublicUserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ['id', 'username']

class FriendRequestSerializer(serializers.ModelSerializer):
        from_user = PublicUserSerializer(read_only=True)
        to_user = PublicUserSerializer(read_only=True)
        class Meta:
            model = FriendRequest
            fields = ['id', 'from_user', 'to_user', 'status','created_at']

        def create(self, validated_data):
            validated_data['from_user'] = self.context['request'].user
            return super().create(validated_data)

class MessageSerializer(serializers.ModelSerializer):
        class Meta:
            model = Message
            fields = ['id', 'sender', 'receiver', 'text', 'timestamp']