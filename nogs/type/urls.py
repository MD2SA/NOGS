from django.urls import path
from . import views

app_name = 'type'

urlpatterns = [
    path('api/generate', views.generate_game, name='generate_game'),
    path('api/submit', views.submit_result, name='submit_result'),
]