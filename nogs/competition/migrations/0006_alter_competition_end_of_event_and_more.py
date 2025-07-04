# Generated by Django 5.2 on 2025-05-10 14:10

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('competition', '0005_remove_competition_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competition',
            name='end_of_event',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='competition',
            name='max_tries',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
