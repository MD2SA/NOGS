from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User, AnonymousUser

from .serializers import UserSerializer


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'detail': 'Username or password is required'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error':'Username already exists'}, status=status.HTTP_409_CONFLICT)
    user = User.objects.create_user(username=username, password=password)
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
    print(f"Is anonymous? {isinstance(request.user, AnonymousUser)}")  # False
    print(f"User after login: {request.user}")  # The logged-in user
    logout(request)
    return Response({'message':'Logged out successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = User.objects.get(username="albuq")
    serializer = UserSerializer(user)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)