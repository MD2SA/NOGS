from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User, AnonymousUser

from .serializers import UserSerializer
from Team.views import handle_leave_team


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'detail': 'Username or password is required'}, status=status.HTTP_400_BAD_REQUEST)
    if len(username) >= 15:
        return Response({'detail': 'Username is too long, 15 characters max'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error':'Username already exists'}, status=status.HTTP_409_CONFLICT)
    user = User.objects.create_user(username=username, password=password)
    authenticate(request, username=username, password=password)
    login(request, user)
    serializer = UserSerializer(user)
    return Response({ 'message': 'Usuário registrado com sucesso','user':serializer.data },
                    status=status.HTTP_201_CREATED
    )

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)  # Cria a sessão
        serializer = UserSerializer(user)
        return Response({'message':'Login bem-sucedido','user':serializer.data},
            status=status.HTTP_200_OK
        )
    return Response({'error':'Credenciais inválidas'},status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message':'Logged out successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ban(request, user_id):
    try:
        if not request.user.is_staff:
            return Response({'error':'Permissions denied'}, status=status.HTTP_403_FORBIDDEN)
        user = User.objects.get(id=user_id)
        handle_leave_team(user)
        user.delete()
        return Response({'message':'User deleted with success'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error':'User not found'}, status=status.HTTP_404_NOT_FOUND)