# Generated by Django 5.2 on 2025-05-10 22:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('competition', '0006_alter_competition_end_of_event_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competitionparticipant',
            name='competition',
            field=models.ForeignKey(default=-1, on_delete=django.db.models.deletion.CASCADE, to='competition.competition'),
            preserve_default=False,
        ),
    ]
