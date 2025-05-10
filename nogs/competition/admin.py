from django.contrib import admin
from .models import Competition, CompetitionParticipant

# Register your models here.
admin.site.register(Competition)
admin.site.register(CompetitionParticipant)