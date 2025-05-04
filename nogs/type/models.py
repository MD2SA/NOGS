from django.db import models
from django.contrib.auth.models import User
import random


class GameManager(models.Manager):
    def create_game(self, mode, time_seconds=None, word_count=None):
        word_list = [
            'python', 'django', 'code', 'keyboard', 'speed',
            'typing', 'developer', 'algorithm', 'function', 'class'
        ]

        if mode == Game.MODE_TIME and time_seconds:
            MAX_WPM = 450
            estimated_words = int((time_seconds / 60) * MAX_WPM)
            phrase = ' '.join(random.choices(word_list, k=estimated_words))
        elif mode == Game.MODE_WORDS and word_count:
            phrase = ' '.join(random.choices(word_list, k=word_count))
        else:
            raise ValueError("Parâmetros inválidos para o modo selecionado")

        return self.create(
            mode=mode,
            time_seconds=time_seconds,
            words_count=word_count,
            phrase=phrase
        )


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
    words_count = models.PositiveIntegerField(null=True, blank=True)

    objects = GameManager()

    def __str__(self):
        return f"Game {self.id} - Mode {self.get_mode_display()} - Phrase: {self.phrase}"


class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100, null=True, blank=True)
    game = models.ForeignKey(Game, on_delete=models.SET_NULL, null=True)
    accuracy = models.FloatField(null=True)
    played_date = models.DateTimeField('date played')
    wpm = models.FloatField(null=True)
    time = models.FloatField(null=True)

    def __str__(self):
        return f"Result {self.id} - Game {self.game.id} - accuracy: {self.accuracy} - played_date: {self.played_date} - wpm: {self.wpm} - time: {self.time}"

class UserStats(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    #Mudar isto para incluir best e avgs para diferentes modos
    #Posso ver o modo atraves do game do result
    best_wpm = models.FloatField(null=True, blank=True)
    avg_wpm = models.FloatField(null=True, blank=True)
    avg_accuracy = models.FloatField(null=True, blank=True)
    total_games = models.PositiveIntegerField(default=0)
    total_time_played = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Stats for {self.user.username}"

class FriendShip(models.Model):
    """atencao na implementacao disto temos de fazer simetria"""
    STATUS_CHOICES = [
        ('pending','Pending'),
        ('accepted','Accepted'),
        ('recused','Recused'),
    ]
    from_user = models.ForeignKey(User,on_delete=models.CASCADE, related_name="friendships_sent")
    to_user = models.ForeignKey(User,on_delete=models.CASCADE, related_name="friendships_received")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES,default='pending')

    class Meta:
        unique_together = ('from_user','to_user')

    def __str__(self):
        return f"{self.from_user} → {self.to_user} ({self.status})"


class Team(models.Model):
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class TeamMembership(models.Model):
    ROLE_CHOICES = [
        ('leader', 'Leader'),
        ('member', 'Member'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} is a {self.get_role_display()} in {self.team.name}"
