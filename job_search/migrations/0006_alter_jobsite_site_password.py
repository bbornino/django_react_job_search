# Generated by Django 4.2.6 on 2024-10-03 22:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job_search', '0005_rename_posting_url_jobposting_posting_url_full_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobsite',
            name='site_password',
            field=models.CharField(blank=True, default='', max_length=64),
        ),
    ]
