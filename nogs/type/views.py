from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import UserStats, User

from .generate import generate_phrase
from .serializers import ResultSerializer, UserStatsSerializer


@api_view(['GET'])
def generate_game(request):
    word_count = request.GET.get('word_count')
    phrase = generate_phrase(word_count)
    return Response({'phrase': phrase}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_result(request):
    try:
        user = User.objects.get(id=request.user.id)
    except User.DoesNotExist:
        return Response({'error':'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ResultSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user)
        return _handle_save_user_stats(request)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def _handle_save_user_stats(request):
    user_stats, created = UserStats.objects.get_or_create(user=request.user)  # Unpack the tuple

    wpm = request.data.get('wpm', 0) or 0  # Default to 0 if None
    accuracy = request.data.get('accuracy', 0) or 0
    time_used = request.data.get('time_used', 0) or 0

    current_best = user_stats.best_wpm or 0
    if wpm > current_best:
        user_stats.best_wpm = wpm

    total_games = user_stats.total_games
    if total_games == 0:
        user_stats.avg_wpm = wpm
        user_stats.avg_accuracy = accuracy
    else:
        user_stats.avg_wpm = (user_stats.avg_wpm * total_games + wpm) / (total_games + 1)
        user_stats.avg_accuracy = (user_stats.avg_accuracy * total_games + accuracy) / (total_games + 1)

    user_stats.total_games += 1
    user_stats.total_time_played += time_used
    user_stats.save()

    return Response({'message': 'Stats saved successfully'}, status=status.HTTP_200_OK)
