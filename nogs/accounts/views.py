from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User, AnonymousUser



@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'detail': 'Username or password is required'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error':'Username already exists'}, status=status.HTTP_409_CONFLICT)
    user = User.objects.create_user(username=username, password=password)
    return Response({ 'message': 'Usuário registrado com sucesso','user':{'id':user.id,'username':user.username}},
                    status=status.HTTP_201_CREATED
    )

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)  # Cria a sessão
        return Response({'message':'Login bem-sucedido','user':{'id':user.id,'username':user.username}},
            status=status.HTTP_200_OK
        )
    return Response({'error':'Credenciais inválidas'},status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def logout_view(request):
    print("On loggout:")
    print(f"Is anonymous? {isinstance(request.user, AnonymousUser)}")  # False
    print(f"User after login: {request.user}")  # The logged-in user
    print(f"Before logout: {request.session.session_key}")
    logout(request)
    print(f"After logout: {request.session.session_key}")
    return Response({'message':'Logged out successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def user_view(request):
    print("On loggout:")
    print(f"Is anonymous? {isinstance(request.user, AnonymousUser)}")  # False
    print(f"User after login: {request.user}")  # The logged-in user
    print(f"Before logout: {request.session.session_key}")
    return Response({'username': request.user.username})