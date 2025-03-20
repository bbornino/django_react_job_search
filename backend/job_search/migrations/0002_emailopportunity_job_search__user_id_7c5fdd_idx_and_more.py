# Generated by Django 5.1.3 on 2025-03-03 22:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job_search', '0001_initial'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='emailopportunity',
            index=models.Index(fields=['user'], name='job_search__user_id_7c5fdd_idx'),
        ),
        migrations.AddIndex(
            model_name='jobposting',
            index=models.Index(fields=['user'], name='job_search__user_id_58c939_idx'),
        ),
        migrations.AddIndex(
            model_name='jobposting',
            index=models.Index(fields=['job_site_id'], name='job_search__job_sit_acb15d_idx'),
        ),
        migrations.AddIndex(
            model_name='jobsite',
            index=models.Index(fields=['user'], name='job_search__user_id_289a17_idx'),
        ),
    ]
