from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from .models import Competition, CompetitionParticipant
from .serializers import CompetitionSerializer, CompetitionParticipantSerializer

@api_view(['GET','POST']) # listar e criar novas competicoes
def competitions(request):
    if request.method == 'GET':
        competition_list = Competition.objects.all()
        serializer = CompetitionSerializer(competition_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = CompetitionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST']) #juntar a competição
@permission_classes([IsAuthenticated])
def join_competition(request, competition_id):
    try:
        competition = Competition.objects.get(id=competition_id, is_active=True)
    except Competition.DoesNotExist:
        return Response({'error': 'competition not found'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if competition.participants.filter(id=user.id).exists():
        return Response({'error': 'user already joined'}, status=status.HTTP_403_FORBIDDEN)

    # noinspection PyUnresolvedReferences
    data = { 'user':user.id, 'competition': competition.id}
    serializer = CompetitionParticipantSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        competition.participants.add(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT']) # ver e modificar participantes em competicao
def competition_details(request, competition_id):
    if request.method == 'GET':
        return get_competition_participants(competition_id)
    elif request.method == 'PUT':
        return update_competition_participant(request, competition_id)


def get_competition_participants(competition_id):
    try:
        participants = CompetitionParticipant.objects.filter(competition=competition_id)
        serializer = CompetitionParticipantSerializer(participants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CompetitionParticipant.DoesNotExist:
        return Response({'error': 'Participants not found'}, status=status.HTTP_404_NOT_FOUND)



def update_competition_participant(request, competition_id):
    try:
        competition = Competition.objects.get(id=competition_id)
        participant = CompetitionParticipant.objects.get(competition=competition, user=request.user)

        if participant.tries_left <= 0:
            return Response({'error': 'Participant has no tries left'}, status=status.HTTP_400_BAD_REQUEST)
        if 'wpm' in request.data and request.data['wpm'] > (participant.wpm or 0):
            participant.wpm = request.data['wpm']
            participant.accuracy = request.data['accuracy']
        participant.tries_left -= 1

        participant.save()
        serializer = CompetitionParticipantSerializer(participant)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Competition.DoesNotExist:
        return Response({'error': 'Competition not found'}, status=status.HTTP_404_NOT_FOUND)
    except CompetitionParticipant.DoesNotExist:
        return Response({'error': 'User not participating in this competition'}, status=status.HTTP_404_NOT_FOUND)

