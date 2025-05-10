from django.db import models
from django.contrib.auth.models import User


class Competition(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    end_of_event = models.DateTimeField(null=True)
    phrase = models.TextField(null=False)
    capacity = models.PositiveIntegerField(null=True, blank=True, default=50)

    participants = models.ManyToManyField(User, through='CompetitionParticipant', related_name='competitions')

class CompetitionParticipant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, null=True)

    wpm = models.IntegerField(null=True, blank=True)
    accuracy = models.FloatField(null=True, blank=True)
    tries_left = models.PositiveIntegerField(null=True, blank=True, default=3)

    class Meta:
        unique_together = ('user', 'competition')
