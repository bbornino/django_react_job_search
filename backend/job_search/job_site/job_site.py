"""
Defines the JobSite model for the Job Search application.

This file contains the `JobSite` model, which represents a job board or platform where a user 
applies for positions. It defines various fields to store information about the job site and 
the user's interaction with it. These fields include details such as the site name, user profile, 
resume format, and timestamps for last visit and resume update.

The `JobSite` model includes the following fields:
- `user`: A foreign key linking to the `CustomUser` model, representing the user associated 
    with this job site.
- `site_name`: The name of the job site.
- `site_url`: The URL of the job site.
- `site_password`: An optional password for the user's account on the site.
- `rating`: A user-defined rating of the site (default is 1).
- `resume_format`: The preferred format for resumes on the site.
- `github_field`: Indicates whether the site requires a GitHub profile.
- `project_site_field`: Indicates whether the site requires a project site link.
- `last_visited_at`: Timestamp of the last visit to the job site.
- `resume_updated_at`: Timestamp of the last update to the user's resume.
- `headline`: A custom headline or title for the user's profile.
- `description`: A detailed description of the user's preferences or profile on the site.

Indexes:
- `user`: Index to optimize queries filtering by user.
- `id`: Automatically indexed by Django for fast lookups.

The `JobSite` model helps to track a user's interactions with different job boards and 
platforms, including their resume status, last visits, and preferences for specific 
fields on each platform.

"""

from datetime import datetime
from typing import Type
from django.db import models
from job_search.models import CustomUser

class JobSite(models.Model):
    """
    JobSite represents a job board or platform where a user applies for positions.

    Fields:
        user (ForeignKey): A reference to the CustomUser associated with this job site.
        site_name (CharField): The name of the job site or platform.
        site_url (CharField): The URL of the job site.
        site_password (CharField): Optional password for the user's account on the site.
        rating (IntegerField): A user-defined rating of the job site, defaulting to 1.

        resume_format (CharField): The preferred format of the resume for this site.
        github_field (BooleanField): Indicates if the site requires a GitHub profile.
        project_site_field (BooleanField): Indicates if the site requires a project site link.
        last_visited_at (DateTimeField): The date and time the user last visited the site.
        resume_updated_at (DateTimeField): The date and time the user's resume was last updated.

        headline (CharField): A custom headline or title used for the user's profile on the site.
        description (TextField): An optional detailed description of the user's profile or 
                            preferences for the site.
        
    Indexes:
        - (user): Optimizes queries filtering by user.
        - (id) (automatically indexed): The primary key for fast lookups.
    """
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE,
        null=True,
    )
    site_name = models.CharField(max_length=64, default='')
    site_url = models.CharField(max_length=2048, default='')
    site_password = models.CharField(max_length=64, default='', blank=True, null=True)
    rating = models.IntegerField(default=1)

    resume_format = models.CharField(max_length=32, default='')
    github_field = models.BooleanField(default=False)
    project_site_field = models.BooleanField(default=False)
    last_visited_at = models.DateTimeField(default=datetime.now, blank=True)
    resume_updated_at = models.DateTimeField(default=datetime.now, blank=True)

    headline = models.CharField(max_length=512, default='')
    description = models.TextField(blank=True, null=True)

    # Explicitly define the manager type for linters
    objects: Type[models.Manager] = models.Manager()

    # pylint: disable=too-few-public-methods
    class Meta:
        """
        Metadata for the JobSite model, defining model-specific options.

        This class includes configuration options for the `JobSite` model, such as:
        - `indexes`: Specifies indexes for optimized database queries. In this case, an 
            index is created on the `user` field to speed up lookups by user.

        The `Meta` class allows you to customize the behavior of the model, like defining 
        indexing strategies, which helps improve query performance.

        Attributes:
            indexes (list): A list of `Index` objects that define custom database indexes.
        """
        indexes = [
            models.Index(fields=["user"]),  # Index on user for faster queries by user
        ]

    def _str_(self):
        return self.site_name
