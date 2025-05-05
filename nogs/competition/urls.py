from django.urls import path
from . import views

app_name = 'competition'

urlpatterns = [
    path('api/competitions', views.competitions),
    path('api/join_competition/<int:competition_id>', views.join_competition),
    path('api/competition_details/<int:competition_id>',views.competition_details),
]
