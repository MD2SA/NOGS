from django.urls import path
from . import views

urlpatterns = [
    path('friends/', views.get_friends, name='get_friends'),
    path('friends/request/',views.send_friend_request,name='send_friend_request'),
    path('friends/respond/', views.respond_to_request, name='respond_to_request'),
    path('friends/all-users/', views.all_users, name='all_users'),
    path('friends/remove/', views.remove_friend, name='remove_friend'),
    path('messages/<int:friend_id>/', views.messages_view, name='messages_view'),
]