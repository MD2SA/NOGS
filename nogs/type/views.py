from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserStats, User

from .generate import generate_phrase

@api_view(['GET'])
def generate_game(request):
    mode = request.GET.get('mode')
    time_seconds = request.GET.get('time_seconds')
    word_count = request.GET.get('word_count')
    phrase = generate_phrase(mode=mode,time_seconds=time_seconds, word_count=word_count)
    return Response({'test': phrase}, status=status.HTTP_200_OK)


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
