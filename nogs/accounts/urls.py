from django.urls import path
from . import views

urlpatterns = [
    path('api/register/', views.register),
    path('api/login/', views.login_view),
    path('api/logout/', views.logout_view),
    path('api/me/', views.me),
    path('api/ban/<int:user_id>', views.ban),
]
