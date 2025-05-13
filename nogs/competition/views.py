from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db import transaction
from .models import Competition, CompetitionParticipant
from .serializers import CompetitionSerializer, CompetitionParticipantSerializer
from .utils import assign_positions


@api_view(['GET','POST'])
def competitions(request):
    """
    GET: List all competitions
    POST: Create a new competition
    """
    if request.method == 'GET':
        return _handle_get_active_competitions()
    elif request.method == 'POST':
        if not request.user or not request.user.is_authenticated or not request.user.is_staff:
            return Response({'detail': 'Authentication as staff required'}, status=status.HTTP_401_UNAUTHORIZED)
        return _handle_create_competition(request)


@api_view(['GET'])
def competition_detail(request, competition_id):
    """
    Get info about a specific competition
    """
    return _handle_get_competition(competition_id)


@api_view(['GET','POST']) # ver competicao
@permission_classes([IsAuthenticated])
def competition_participants(request, competition_id):
    """
    GET: List all competition participants
    POST: Join competition (add participant)
    """
    if request.method == 'GET':
        return _handle_get_participants(competition_id)
    elif request.method == 'POST':
        return _handle_join_competition(request, competition_id)

@api_view(['GET','PUT'])
@permission_classes([IsAuthenticated])
def competitions_of_participant(request):
    """
    GET: List all unactive competitions user has joined but hasn't acknowledged yet
    PUT: User acknowledge competitions that have ended
    """
    if request.method == 'GET':
        return _handle_get_nack_competitions(request)
    elif request.method == 'PUT':
        return _handle_acknowledge_competitions(request)

@api_view(['POST'])
def competition_try(request,competition_id):
    """
    Try a competition
    """
    return _handle_try_competition(request,competition_id)


@api_view(['POST'])
def competition_submit(request,competition_id):
    """
    Submit game results
    """
    return _handle_submit_game(request,competition_id)


def _handle_get_active_competitions():
    active_competitions = Competition.objects.filter(end_of_event__gt=timezone.now())
    serializer = CompetitionSerializer(active_competitions, many=True)
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
    if user in competition.participants.all():
        return Response({'message':'User already joined'}, status=status.HTTP_200_OK)

    current_lotation = competition.participants.count()
    if competition.capacity and current_lotation >= competition.capacity:
        return Response({'error': 'Competition is full'}, status=status.HTTP_400_BAD_REQUEST)

    data = { 'user':user.id, 'competition': competition.pk, 'tries': competition.max_tries }
    serializer = CompetitionParticipantSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def _handle_get_nack_competitions(request):
    participations = (
        CompetitionParticipant.objects
        .filter(user=request.user, ack=False, competition__end_of_event__lt=timezone.now())
        .select_related('competition')
    )
    for participation in participations:
        competition = participation.competition
        if not competition.ranked:
            try:
                with transaction.atomic():
                    assign_positions(competition)
                    competition.ranked = True
                    competition.save(update_fields=['ranked'])
            except Exception as e:
                continue

    serializer = CompetitionParticipantSerializer(participations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK )

def _handle_acknowledge_competitions(request):
    competitions_ids =  []
    for participation in request.data:
        competitions_ids.append(participation['competition'])
    participations = (CompetitionParticipant.objects.filter(
        user=request.user,
        ack=False,
        competition__end_of_event__lt=timezone.now()
    ))
    for participation in participations:
        competition = participation.competition
        if competition.id in competitions_ids:
            participation.ack = True
            participation.save(update_fields=['ack'])
    return Response({}, status=status.HTTP_200_OK)


def _handle_try_competition(request,competition_id):
    try:
        competition = Competition.objects.get(id=competition_id)
        participant = CompetitionParticipant.objects.get(competition=competition, user=request.user)
    except Competition.DoesNotExist:
        return Response({'error':'Competition does not exists'}, status=status.HTTP_404_NOT_FOUND)
    except CompetitionParticipant.DoesNotExist:
        return Response({'error':'User is not in competition'}, status=status.HTTP_404_NOT_FOUND)
    if participant.tries is not None:
        participant.tries-=1
        participant.save()
    return Response({'tries':participant.tries}, status=status.HTTP_200_OK)


def _handle_submit_game(request, competition_id):
    try:
        competition = Competition.objects.get(id=competition_id)
        participant = CompetitionParticipant.objects.get(competition=competition,user=request.user)
    except Competition.DoesNotExist:
        return Response({'error':'Competition does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except CompetitionParticipant.DoesNotExist:
        return Response({'error': 'User not participating in this competition'}, status=status.HTTP_404_NOT_FOUND)

    if participant.tries is not None and participant.tries < 0:
        return Response({'error': 'Participant has no tries left'}, status=status.HTTP_400_BAD_REQUEST)

    if 'wpm' in request.data and request.data['wpm'] >= (participant.wpm or 0):
        participant.wpm = request.data['wpm']
        if 'accuracy' in request.data and request.data['accuracy'] > (participant.accuracy or 0) :
            participant.accuracy = request.data['accuracy']
        participant.save()

    return Response(CompetitionParticipantSerializer(participant).data, status=status.HTTP_200_OK)