from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import UserStats, User

from .generate import generate_phrase


@api_view(['GET'])
def generate_game(request):
    mode = request.GET.get('mode')
    time_seconds = request.GET.get('time_seconds')
    word_count = request.GET.get('word_count')
    phrase = generate_phrase(
        mode=mode, time_seconds=time_seconds, word_count=word_count)
    return Response({'test': phrase}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_result(request):
    user = request.user
