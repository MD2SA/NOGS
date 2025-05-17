from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse, HttpResponseNotFound

from .models import Team, TeamMembership, TeamMessage
from .serializers import TeamSerializer, TeamMembershipSerializer, TeamMessageSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated]) #user tem que estar logado,se nao da erro
def join_team(request, team_id):
    try:
        team = Team.objects.get(id=team_id)
    except Team.DoesNotExist:
        return Response({'error': 'Team not found'}, status=status.HTTP_404_NOT_FOUND)
    if TeamMembership.objects.filter(user=request.user).exists():
        return Response({'error': 'User already in a team'}, status=status.HTTP_400_BAD_REQUEST)
    data = {
        'user': request.user.id,
        'team': team.id,
        'role': 'member'
    }
    serializer = TeamMembershipSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def team_list(request):
    if request.method == 'GET':
        teams = Team.objects.all()
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid method'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def leave_team(request):
    try:
        membership = TeamMembership.objects.get(user=request.user)
        membership.delete()
        team = membership.team
        if not TeamMembership.objects.filter(team=team).exists():
            team.delete()
            return Response({'message': 'Left the team successfully'}, status=status.HTTP_204_NO_CONTENT)
        if membership.role == 'leader':
            oldest_membership = TeamMembership.objects.filter(team=membership.team).order_by('joined_at').first()
            oldest_membership.role = 'leader'
            oldest_membership.save()
        return Response({'message': 'Left the team successfully'}, status=status.HTTP_204_NO_CONTENT)
    except TeamMembership.DoesNotExist:
        return Response({'error': 'User is not in any team'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_team(request):
    serializer = TeamSerializer(data=request.data)
    if serializer.is_valid():
        team = serializer.save()
        TeamMembership.objects.create(
            user=request.user,
            team=team,
            role='leader'
        )
        return Response(TeamSerializer(team).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def team_detail(request, team_id):
    try:
        team = Team.objects.get(pk=team_id)
        return JsonResponse({
            'id': team.id,
            'name': team.name,
            'description': team.description,
            'members': list(team.members.values('id', 'username')),  # ajusta se quiseres
        })
    except Team.DoesNotExist:
        return HttpResponseNotFound("Team not found")



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_team(request):
    try:
        membership = TeamMembership.objects.get(user=request.user)
        team = membership.team
        serializer = TeamSerializer(team)
        return Response(serializer.data, status=200)
    except TeamMembership.DoesNotExist:
        return Response({"detail": "Not in a team"}, status=404)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def team_messages_view(request, team_id):
    user = request.user

    try:
        TeamMembership.objects.get(user=user, team_id=team_id)
    except TeamMembership.DoesNotExist:
        return Response({'error': 'You are not a member of this team'}, status=403)
    if request.method == 'GET':
        messages = TeamMessage.objects.filter(team_id=team_id)
        serializer = TeamMessageSerializer(messages, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        text = request.data.get('text')
        if not text:
            return Response({'error': 'Text is required'}, status=400)
        message = TeamMessage.objects.create(
            sender=user, team_id=team_id, text=text
        )
        serializer = TeamMessageSerializer(message)
        return Response(serializer.data, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def kick(request, user_id):
    user = request.user
    try:
        leader_membership = TeamMembership.objects.get(user=user)
    except TeamMembership.DoesNotExist:
        return Response({'error': 'Player is not in any team'}, status=status.HTTP_404_NOT_FOUND)

    if leader_membership.role != 'leader':
        return Response({'error': 'Permissions insufficient for this action'}, status=status.HTTP_401_UNAUTHORIZED)

    if user_id == user.id:
        return Response({'error':'Cannot kick self'}, status=status.HTTP_400_BAD_REQUEST)

    target_membership = TeamMembership.objects.filter(user=user_id,team=leader_membership.team)
    if not target_membership.exists():
        return Response({'detail':'User is not in this team'}, status=status.HTTP_404_NOT_FOUND)
    target_membership.delete()

    return Response({'message':'User kicked successfully'}, status=status.HTTP_200_OK)