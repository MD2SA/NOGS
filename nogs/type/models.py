from django.db import models
from django.contrib.auth.models import User
from .generate import generate_phrase

class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    accuracy = models.FloatField(0)
    wpm = models.FloatField()
    time_used = models.FloatField()
    played_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result {self.id} - Game {self.game.id} - accuracy: {self.accuracy} - played_date: {self.played_date} - wpm: {self.wpm} - time: {self.time}"


class UserStats(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    best_wpm = models.FloatField(null=True, blank=True)
    avg_wpm = models.FloatField(null=True, blank=True)
    avg_accuracy = models.FloatField(null=True, blank=True)
    total_games = models.PositiveIntegerField(default=0)
    total_time_played = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Stats for {self.user.username}"
