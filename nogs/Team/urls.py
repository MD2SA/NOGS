from django.urls import path
from . import views

app_name = 'team'

urlpatterns = [
    path('teams/', views.team_list, name='team-list'),
    path('teams/create/', views.create_team, name='create-team'),
    path('teams/<int:team_id>/join/', views.join_team, name='join-team'),
    path('teams/leave/', views.leave_team, name='leave-team'),
    path('teams/<int:team_id>/', views.team_detail, name='team-detail'),
]