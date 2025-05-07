from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import UserStats, User

from .generate import generate_phrase
from .serializers import ResultSerializer, GameSerializer


@api_view(['GET'])
def generate_game(request):
    game_serializer = GameSerializer(data=request.data)
    if game_serializer.is_valid():
        game_serializer.save()
        return Response(game_serializer.data, status=status.HTTP_200_OK)
    return Response(game_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_result(request):
    user = request.user
    if user is not None:
        serializer = ResultSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
