from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Result, Game  # certifique-se de importar Game corretamente

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

# Serializer para Result
class ResultSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField() # makes 'user' call method
    game = GameSerializer()

    class Meta:
        model = Result
        # 'user' -> calls get_user
        fields = ['id', 'user', 'game', 'accuracy', 'played_date', 'wpm', 'time']

    # obj is the instance o result being serialized
    def get_user(self, obj):
        if obj.user:
            return UserSerializer(obj.user).data
        else:
            return{
                "id":None,
                "username":"Anonymous",
                "email":None,
            }

