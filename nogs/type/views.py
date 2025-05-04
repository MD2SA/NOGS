import json
import random
from pathlib import Path
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Game, UserStats, User

@api_view(['GET'])
def generate_game(request):
    mode = request.GET.get('mode')
    time_seconds = validate_input(
        request.GET.get('time_seconds'), MAX_TIME_SECONDS)
    word_count = validate_input(request.GET.get('word_count'), MAX_WORD_COUNT)
    try:
        if mode == Game.MODE_TIME and time_seconds:
            estimated_words = int((time_seconds / 60) * MAX_WPM)
            text = generate_words(estimated_words)
        elif mode == Game.MODE_WORDS and word_count:
            text = generate_words(word_count)
        else:
            return Response(
                {'error': 'Invalid parameters for selected mode or out-of-range values'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response({'test': text}, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def submit_result(request):
    try:
        user_id = int(request.data.get('user_id'))
        accuracy = float(request.data.get('accuracy'))
        time_used = int(request.data.get('time_used'))
        wpm = int(request.data.get('wpm'))
    except (TypeError, ValueError):
        return Response({'error': 'Invalid input data types.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    stats, created = UserStats.objects.get_or_create(user=user)

    total_games = stats.total_games
    stats.avg_wpm = ((stats.avg_wpm or 0)*total_games + wpm) / (total_games + 1)
    stats.avg_accuracy = ((stats.avg_accuracy or 0) * total_games + accuracy) / (total_games + 1)
    stats.best_wpm = max((stats.best_wpm or 0), wpm)
    stats.total_time_played += time_used
    stats.total_games += 1

    stats.total_time_played += time_used
    stats.save()

    return Response(status=status.HTTP_200_OK)
