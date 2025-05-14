from django.db import models
from django.contrib.auth.models import User
from .generate import generate_phrase

class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    accuracy =  models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    wpm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    time_used = models.FloatField()
    played_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result {self.id} - accuracy: {self.accuracy} - played_date: {self.played_date} - wpm: {self.wpm} - time: {self.time_used}"


class UserStats(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    best_wpm = models.FloatField(null=True, blank=True)
    avg_wpm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    avg_accuracy = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    total_games = models.PositiveIntegerField(default=0)
    total_time_played = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Stats for {self.user.username}"
