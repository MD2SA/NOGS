from django.db import models
from django.contrib.auth.models import User


class Competition(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    end_of_event = models.DateTimeField(null=False)
    phrase = models.TextField(null=False)
    capacity = models.PositiveIntegerField(null=True, blank=True)
    max_tries = models.PositiveIntegerField(null=True, blank=True)

    participants = models.ManyToManyField(User, through='CompetitionParticipant', related_name='competitions')

class CompetitionParticipant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)

    wpm = models.IntegerField(null=True, blank=True)
    accuracy = models.FloatField(null=True, blank=True)
    tries = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('user', 'competition')
