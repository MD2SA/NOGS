from django.db import transaction
from competition.models import CompetitionParticipant


def assign_positions(competition):
    participants = (
        CompetitionParticipant.objects
        .filter(competition=competition, wpm__isnull=False, accuracy__isnull=False)
        .order_by('-wpm', '-accuracy')  # Highest WPM and accuracy first
    )

    with transaction.atomic():
        for position, participant in enumerate(participants, start=1):
            participant.position = position
            participant.save(update_fields=['position'])
