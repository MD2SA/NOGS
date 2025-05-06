from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User, AnonymousUser

from .serializers import RegisterSerializer, UserSerializer


@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        if User.objects.filter(username=serializer.validated_data.get('username')).exists():
            return Response({'error':'Username already exists'}, status=status.HTTP_409_CONFLICT)
        user = serializer.save()
        user_data = UserSerializer(user).data
        return Response({'message': f'User {user.username} created successfully', 'user':user_data}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request,username=username,password=password)
    if user is not None:
        login(request, user)
        print("After login:")
        print(f"Is anonymous? {isinstance(request.user, AnonymousUser)}")  # False
        print(f"User after login: {request.user}")  # The logged-in user
        session_key = request.session.session_key
        print(f"Session Key: {session_key}")

        user_data = UserSerializer(user).data
        return Response({'message': 'Logged in successfully}', 'user':user_data}, status=status.HTTP_200_OK)
    return Response({'error':'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

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
 return Response({'username': request.user})