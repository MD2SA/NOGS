from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from django.contrib.auth.models import User
from .models import Report
from .serializers import ReportSerializer, UserWithReportsSerializer


@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def report(request):
    if request.method == 'GET':
        if not request.user.is_staff:
            return Response({'error':'No permissions for this action'}, status=status.HTTP_403_FORBIDDEN)
        users = User.objects.all()
        serializer = UserWithReportsSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = ReportSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'User reported successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)