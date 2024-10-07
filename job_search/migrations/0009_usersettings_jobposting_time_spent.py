# Generated by Django 4.2.6 on 2024-10-07 15:48

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job_search', '0008_alter_jobposting_applied_at_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_greeting', models.CharField(max_length=24)),
                ('color_mode', models.CharField(max_length=24)),
                ('dashboard_first_date', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('dashboard_second_date', models.DateTimeField(blank=True, default=datetime.datetime.now)),
            ],
        ),
        migrations.AddField(
            model_name='jobposting',
            name='time_spent',
            field=models.IntegerField(default=1),
        ),
    ]
