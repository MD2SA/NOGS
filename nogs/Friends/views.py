from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.db.models import Q
from pprint import pprint

from .models import FriendRequest, Message
from .serializers import FriendRequestSerializer, MessageSerializer, PublicUserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friends(request):
    print("🔍 get_friends called by", request.user)
    try:
        user = request.user

        accepted = FriendRequest.objects.filter(
            Q(from_user=user) | Q(to_user=user),
            status='accepted'
        )
        friends = [
            fr.to_user if fr.from_user == user else fr.from_user
            for fr in accepted
        ]

        sent_ids = FriendRequest.objects.filter(
            from_user=user, status='pending'
        ).values_list('to_user', flat=True)
        sent_users = User.objects.filter(id__in=sent_ids)

        received_requests = FriendRequest.objects.filter(
            to_user=user, status='pending'
        )

        # 👇 build received list manually (includes FriendRequest.id as request_id)
        received = [
            {
                'id': fr.from_user.id,
                'username': fr.from_user.username,
                'request_id': fr.id
            }
            for fr in received_requests
        ]

        return Response({
            'friends': PublicUserSerializer(friends, many=True).data,
            'sent_requests': PublicUserSerializer(sent_users, many=True).data,
            'received_requests': received  # 👈 custom dict list here only
        })

    except Exception as e:
        print("🔥 ERROR in get_friends:", e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
    user = request.user
    to_user_id = request.data.get('to_user_id')

    if not to_user_id:
        return Response({'error': 'to_user_id is required'}, status=400)

    if str(to_user_id) == str(user.id):
        return Response({'error': 'Cannot send request to yourself'}, status=400)

    try:
        to_user = User.objects.get(id=to_user_id)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=404)

    existing_reverse = FriendRequest.objects.filter(
        from_user=to_user,
        to_user=user,
        status='pending'
    ).first()

    if existing_reverse:
        existing_reverse.status = 'accepted'
        existing_reverse.save()
        return Response({'message': 'Accepted existing friend request from that user'})

    if FriendRequest.objects.filter(from_user=user, to_user=to_user).exists():
        return Response({'error': 'Friend request already sent'}, status=400)

    fr = FriendRequest.objects.create(
        from_user=user,
        to_user=to_user,
        status='pending'
    )

    return Response(FriendRequestSerializer(fr).data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_to_request(request):
    print("🔥 HIT respond_to_request view")

    user = request.user
    request_id = request.data.get('request_id')
    action = request.data.get('action')

    print("🔍 request_id:", request_id)
    print("🔍 action:", action)
    print("👤 current user:", user)
    print("📡 all pending requests to user:", list(
        FriendRequest.objects.filter(to_user=user, status='pending')
    ))

    if not request_id or not action:
        return Response({'error': 'request_id and action are required'}, status=400)

    print("🧾 All FriendRequests:")
    pprint(list(FriendRequest.objects.all()))

    try:
        fr = FriendRequest.objects.get(id=int(request_id))
    except FriendRequest.DoesNotExist:
        return Response({'error': 'Friend request not found'}, status=404)

    if fr.to_user != user:
        return Response({'error': 'You are not authorized to respond to this request'}, status=403)

    if fr.status != 'pending':
        return Response({'error': 'This request has already been handled'}, status=400)

    if action == 'accept':
        fr.status = 'accepted'
        fr.save()
        return Response({'message': 'Friend request accepted'})

    elif action == 'reject':
        fr.delete()
        return Response({'message': 'Friend request rejected'})

    return Response({'error': 'Invalid action'}, status=400)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def messages_view(request, friend_id):
    user = request.user
    try:
        friend = User.objects.get(id=friend_id)
    except User.DoesNotExist:
        return Response({'error': 'Friend not found'}, status=404)

    if request.method == 'GET':
        messages = Message.objects.filter(
            Q(sender=user, receiver=friend) | Q(sender=friend, receiver=user)
        ).order_by('timestamp')

        return Response(MessageSerializer(messages, many=True).data)

    elif request.method == 'POST':
        text = request.data.get('text')
        if not text:
            return Response({'error': 'Text is required'}, status=400)

        msg = Message.objects.create(sender=user, receiver=friend, text=text)
        return Response(MessageSerializer(msg).data, status=201)

    return Response({'error': 'Method not allowed'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def remove_friend(request):
    user = request.user
    friend_id = request.GET.get('friend_id')
    print("🗑 remove_friend called by:", user)
    print("🧍‍♂️ friend_id received:", friend_id)

    if not friend_id:
        return Response({'error': 'friend_id is required'}, status=400)

    try:
        friend = User.objects.get(id=friend_id)
    except User.DoesNotExist:
        return Response({'error': 'Friend not found'}, status=404)

    fr = FriendRequest.objects.filter(
        Q(from_user=user, to_user=friend) | Q(from_user=friend, to_user=user),
        status='accepted'
    ).first()

    if fr:
        print("✅ Deleting friendship between", user, "and", friend)
        fr.delete()
        return Response({'message': 'Friend removed successfully'})

    print("❌ No accepted friendship found")
    return Response({'error': 'Friendship not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_users(request):
    current_user = request.user
    print(User.objects.all())
    users = User.objects.exclude(id=current_user.id)
    print(users)
    return Response(PublicUserSerializer(users, many=True).data)
