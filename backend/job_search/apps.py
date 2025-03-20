"""
Django app configuration for the `job_search` application.

This file defines the configuration for the `job_search` app within the Django project.
The configuration class `JobSearchConfig` contains settings related to the app, including 
the default auto field type and the name of the app.

Classes:
    JobSearchConfig (AppConfig):
        Configures the `job_search` app, setting the default auto field type and app name.
"""

from django.apps import AppConfig

class JobSearchConfig(AppConfig):
    """
    Configuration class for the `job_search` Django application.

    This class holds the configuration for the `job_search` app, including the setting for 
    the default auto field type (`BigAutoField`) and the app name (`'job_search'`).
    This is used to configure the app when Django starts.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'job_search'
