from django.contrib import admin
from .models import Team, TeamMembership

# Register your models here.
admin.site.register(Team)
admin.site.register(TeamMembership)