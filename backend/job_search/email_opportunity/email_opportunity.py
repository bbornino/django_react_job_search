"""
This module defines the EmailOpportunity model, representing a potential job opportunity communicated through email.

The EmailOpportunity model stores relevant details about a job opportunity, including the job title, recruiter details, 
employment type, location, and status. It also allows users to store comments and the full job description received via email.

Attributes:
    user (ForeignKey): A reference to the CustomUser associated with this opportunity.
    job_title (CharField): The title of the job opportunity.
    opportunity_status (CharField): The current status of the opportunity (e.g., pending, rejected, accepted).
    recruiter_name (CharField): The name of the recruiter associated with the opportunity.
    recruiter_company (CharField): The company the recruiter represents.
    email_received_at (DateTimeField): The date and time the opportunity email was received.
    employment_type (CharField): The type of employment offered (e.g., full-time, part-time, contract).
    job_duration (CharField): The duration of the job, if specified (e.g., permanent, 6-month contract).
    location_type (CharField): The type of work location (e.g., remote, hybrid, on-site).
    location_city (CharField): The city where the job is located, if applicable.
    comments (JSONField): A JSON array to store user comments related to the opportunity.
    job_description (TextField): The full description of the job opportunity as provided in the email.

Indexes:
    - (user): Optimizes queries filtering by user.

Methods:
    __str__: Returns the job title as the string representation of the object.
"""

from datetime import datetime
from typing import Type
from django.db import models
from job_search.models import CustomUser

class EmailOpportunity(models.Model):
    """
    EmailOpportunity represents a potential job opportunity communicated through email.

    Fields:
        user (ForeignKey): A reference to the CustomUser associated with this opportunity.
        job_title (CharField): The title of the job opportunity.
        opportunity_status (CharField): The current status of the opportunity (e.g., pending, rejected, accepted).
        recruiter_name (CharField): The name of the recruiter associated with the opportunity.
        recruiter_company (CharField): The company the recruiter represents.

        email_received_at (DateTimeField): The date and time the opportunity email was received.
        employment_type (CharField): The type of employment offered (e.g., full-time, part-time, contract).
        job_duration (CharField): The duration of the job, if specified (e.g., permanent, 6-month contract).
        location_type (CharField): The type of work location (e.g., remote, hybrid, on-site).
        location_city (CharField): The city where the job is located, if applicable.

        comments (JSONField): A JSON array to store user comments related to the opportunity.
        job_description (TextField): The full description of the job opportunity as provided in the email.

    Indexes:
        - (user): Optimizes queries filtering by user.
        - (id) (automatically indexed): The primary key for fast lookups.

    Methods:
        __str__: Returns the job title as the string representation of the object.
    """
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE,
        null=True,
    )
    job_title = models.CharField(max_length=128)
    opportunity_status = models.CharField(max_length=48)
    recruiter_name = models.CharField(max_length=64)
    recruiter_company = models.CharField(max_length=64)

    email_received_at = models.DateTimeField(default=datetime.now, blank=True)
    employment_type = models.CharField(max_length=24, default='')
    job_duration = models.CharField(max_length=64, default='')
    location_type = models.CharField(max_length=32, default='')
    location_city = models.CharField(max_length=64, default='')
    comments = models.JSONField(default=list, blank=True, null=True)
    job_description = models.TextField(default='', blank=True, null=True)

    # Explicitly define the manager type for linters
    objects: Type[models.Manager] = models.Manager()

    class Meta:
        indexes = [
            models.Index(fields=["user"]),  # Index on user for faster queries by user
        ]

    def _str_(self):
        return self.job_title
