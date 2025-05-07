from django.urls import path
from . import views

app_name = 'competition'

urlpatterns = [
    path('api/competitions', views.competitions),
    path('api/competition/<int:competition_id>',views.competition),
    path('api/competition_participants/<int:competition_id>', views.competition_participants),
]
