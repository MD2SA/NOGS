from django.urls import path
from . import views

app_name = 'competition'

urlpatterns = [
    path('api/competitions', views.competitions),
    path('api/competition/<int:competition_id>',views.competition_detail),
    path('api/competition/<int:competition_id>/participants', views.competition_participants),
    path('api/competition/<int:competition_id>/try', views.competition_try),
    path('api/competition/<int:competition_id>/submit', views.competition_submit),
]
