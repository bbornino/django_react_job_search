from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class CustomUser(AbstractUser):
    """
    CustomUser extends Django's AbstractUser model to include additional user-specific fields.

    Fields:
        bio (TextField): A brief biography or description of the user.
        user_greeting (CharField): A short, customizable greeting message for the user.
        color_mode (CharField): User's preferred color mode, e.g., 'light' or 'dark'.
        dashboard_first_date (DateTimeField): The first date selected by the user for dashboard filters.
        dashboard_second_date (DateTimeField): The second date selected by the user for dashboard filters.
    """
    bio = models.TextField()
    user_greeting = models.CharField(max_length=24)
    color_mode = models.CharField(max_length=24)
    dashboard_first_date = models.DateTimeField(blank=True, null=True)
    dashboard_second_date = models.DateTimeField(blank=True, null=True)