from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import Competition, CompetitionParticipant
from .serializers import CompetitionSerializer, CompetitionParticipantSerializer
from django.contrib.auth.models import User, AnonymousUser

@api_view(['GET','POST']) # listar e criar novas competicoes
def competitions(request):
    print("On competitions page:")
    print(f"Is anonymous? {isinstance(request.user, AnonymousUser)}")  # False
    print(f"User after login: {request.user}")  # The logged-in user
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


@api_view(['GET','POST']) # ver competicao
def competition(request, competition_id):
    if request.method == 'GET':
        try:
            competition = Competition.objects.get(id=competition_id)
            serializer = CompetitionSerializer(competition)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Competition.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'POST':
        return enter_competition(request, competition_id)


@api_view(['GET','PUT']) #post and get participants
def competition_participants(request,competition_id):
    if request.method == 'GET':
        try:
            participants = CompetitionParticipant.objects.filter(competition=competition_id)
            serializer = CompetitionParticipantSerializer(participants, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CompetitionParticipant.DoesNotExist:
            return Response({'error': 'Participants not found'}, status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'PUT':
        return update_competition_participant(request,competition_id)



def update_competition_participant(request, competition_id):
    try:
        competition = Competition.objects.get(id=competition_id)

        user = User.objects.get(id=11)
        participant = CompetitionParticipant.objects.get(competition=competition, user=user)

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



def enter_competition(request, competition_id):
    try:
        competition = Competition.objects.get(id=competition_id, is_active=True)
    except Competition.DoesNotExist:
        return Response({'error': 'Competition not found'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if competition.participants.filter(id=user.id).exists():
        return Response({'detail': 'User already joined'}, status=status.HTTP_302_FOUND)
    current_lotation = competition.participants.count()
    if competition.capacity and current_lotation >= competition.capacity:
        return Response({'error': 'Competition is full'}, status=status.HTTP_400_BAD_REQUEST)

    # noinspection PyUnresolvedReferences
    data = { 'user':user.id, 'competition': competition.id}
    serializer = CompetitionParticipantSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        competition.participants.add(user.id)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
