from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse, HttpResponseNotFound

from .models import Team, TeamMembership
from .serializers import TeamSerializer, TeamMembershipSerializer


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
        return Response({'message': 'Left the team successfully'}, status=status.HTTP_204_NO_CONTENT)
    except TeamMembership.DoesNotExist:
        return Response({'error': 'User is not in any team'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_team(request):
    serializer = TeamSerializer(data=request.data)
    print(serializer.is_valid())
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
