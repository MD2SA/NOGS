from django.urls import path
from . import views

app_name = 'report'

urlpatterns = [
    path('api/report', views.report),
]