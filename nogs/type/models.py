from django.db import models
from django.contrib.auth.models import User
from .generate import generate_phrase


class Game(models.Model):
    MODE_WORDS = 'words'
    MODE_TIME = 'time'

    MODE_CHOICES = [
        (MODE_WORDS, 'Words'),
        (MODE_TIME, 'Time'),
    ]

    phrase = models.TextField()
    mode = models.CharField(max_length=10, choices=MODE_CHOICES)
    time_seconds = models.PositiveIntegerField(null=True, blank=True)
    word_count = models.PositiveIntegerField(null=True, blank=True)

    def save(self, *args, **kwargs):
       if not self.phrase:
           self.phrase = generate_phrase(
               mode=self.mode,
               time_seconds=self.time_seconds,
               word_count=self.word_count,
           )
       super().save(*args, **kwargs)

    def __str__(self):
        return f"Game {self.id} - Mode {self.get_mode_display()} - Phrase: {self.phrase}"


class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.SET_NULL, null=True)
    accuracy = models.FloatField(null=True)
    wpm = models.FloatField(null=True)
    time = models.FloatField(null=True)
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