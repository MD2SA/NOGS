from django.urls import path
from . import views

app_name = 'type'

urlpatterns = [
    path('api/', views.generate_game, name='generate_game'),
]