from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import  *
from .models import *

DEFAULT_WORD_LIST = [
    'python', 'django', 'code', 'keyboard', 'speed',
    'typing', 'developer', 'algorithm', 'function', 'class'
]
MAX_WPM = 450
MAX_TIME_SECONDS = 600  # 10 minutos
MAX_WORD_COUNT = 4500


@api_view(['GET'])
def generate_game(request, mode, time_seconds=None, word_count=None):
    try:
        if mode == Game.MODE_TIME and time_seconds:
            time_seconds = int(time_seconds)
            if not (1 <= time_seconds <= MAX_TIME_SECONDS):
                return Response(
                    {'error': f'Time should be between 1 and {MAX_TIME_SECONDS} seconds'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            estimated_words = int((time_seconds / 60) * MAX_WPM)
            phrase = ' '.join(random.choices(DEFAULT_WORD_LIST, k=estimated_words))

        elif mode == Game.MODE_WORDS and word_count:
            word_count = int(word_count)
            if not (1 <= word_count <= MAX_WORD_COUNT):
                return Response(
                    {'error': f'Word count should be between 1 and {MAX_WORD_COUNT} words'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            phrase = ' '.join(random.choices(DEFAULT_WORD_LIST, k=word_count))

        else:
            return Response(
                {'error': 'Invalid parameters for selected mode'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({'phrase': phrase})

    except (ValueError, TypeError):
        return Response(
            {'error': 'Parameters must be valid integers'},
            status=status.HTTP_400_BAD_REQUEST
        )