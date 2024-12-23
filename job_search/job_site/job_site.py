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
        description (TextField): An optional detailed description of the user's profile or preferences for the site.
    """
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE,
        null=True, # Temporary.  To be removed after migration
        # default=1,  # Set the default user ID
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

    def _str_(self):
        return self.site_name
