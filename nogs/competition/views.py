from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import Competition, CompetitionParticipant
from .serializers import CompetitionSerializer, CompetitionParticipantSerializer
from django.contrib.auth.models import User, AnonymousUser

@api_view(['GET','POST'])
def competitions(request):
    """
    GET: List all competitions
    POST: Create a new competition
    """
    if request.method == 'GET':
        return _handle_get_competitions()
    elif request.method == 'POST':
        return _handle_create_competition(request)


@api_view(['GET'])
def competition_detail(request, competition_id):
    """
    Get info about a specific competition
    """
    return _handle_get_competition(competition_id)


@api_view(['GET','POST']) # ver competicao
def competition_participants(request, competition_id):
    """
    GET: List all competition participants
    POST: Join competition (add participant)
    """
    if request.method == 'GET':
        return _handle_get_participants(competition_id)
    elif request.method == 'POST':
        return _handle_join_competition(request, competition_id)

@api_view(['POST'])
def competition_play(request,competition_id):
    """
    Submit game results
    """
    return _handle_play_game(request,competition_id)


def _handle_get_competitions():
    competitions = Competition.objects.filter(end_of_event__gt=timezone.now())
    serializer = CompetitionSerializer(competitions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

def _handle_create_competition(request):
    serializer = CompetitionSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def _handle_get_competition(competition_id):
    try:
        competition = Competition.objects.get(id=competition_id)
        return Response(CompetitionSerializer(competition).data)
    except Competition.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


def _handle_get_participants(competition_id):
    try:
        competition = Competition.objects.get(id=competition_id)
        participants = CompetitionParticipant.objects.filter(competition=competition)
    except Competition.DoesNotExist:
        return Response({'error':'Competition does not exist'},status=status.HTTP_404_NOT_FOUND)
    return Response(CompetitionParticipantSerializer(participants, many=True).data, status=status.HTTP_200_OK)


def _handle_join_competition(request, competition_id):
    try:
        competition = Competition.objects.get(id=competition_id)
    except Competition.DoesNotExist:
        return Response({'error':'Competition does not exists'}, status=status.HTTP_404_NOT_FOUND)
    if competition.end_of_event <= timezone.now():
        return Response({'error':'Competition has already ended'}, status=status.HTTP_409_CONFLICT)

    user = request.user
    if competition.participants.filter(user=user).exists():
        return Response({'error':'User already joined'}, status=status.HTTP_409_CONFLICT)

    current_lotation = competition.participants.count()
    if competition.capacity and current_lotation >= competition.capacity:
        return Response({'error': 'Competition is full'}, status=status.HTTP_400_BAD_REQUEST)

    data = { 'user':user.id, 'competition': competition.id}
    serializer = CompetitionParticipantSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        competition.participants.add(user.id)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



def _handle_play_game(request, competition_id):
    try:
        competition = Competition.objects.get(id=competition_id)
        participant = CompetitionParticipant.objects.get(competition=competition,user=request.user)
    except Competition.DoesNotExist:
        return Response({'error':'Competition does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except CompetitionParticipant.DoesNotExist:
        return Response({'error': 'User not participating in this competition'}, status=status.HTTP_404_NOT_FOUND)

    if participant.tries is not None and participant.tries >= competition.max_tries:
        return Response({'error': 'Participant has no tries left'}, status=status.HTTP_400_BAD_REQUEST)

    if 'wpm' in request.data and request.data['wpm'] > (participant.wpm or 0):
        participant.wpm = request.data['wpm']
        participant.accuracy = request.data['accuracy']

    participant.tries += 1
    participant.save()
    return Response(CompetitionParticipantSerializer(participant).data, status=status.HTTP_200_OK)