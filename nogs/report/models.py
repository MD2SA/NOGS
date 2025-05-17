from django.db import models
from django.contrib.auth.models import User


class Report(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_received')
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reports_created')

    def __str__(self):
        return self.user.username

