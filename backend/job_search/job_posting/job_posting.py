"""
JobPosting model for tracking job applications.

This module defines the JobPosting model, which represents job listings that 
a user applies to via various job sites. It includes details such as company 
name, job title, application status, URLs, salary range, and metadata related 
to the job search process.

Classes:
    - JobPosting: A Django model representing a job posting, with fields 
      for company details, job application status, timestamps, job descriptions, 
      and technology stack.

Model Fields:
    - user (ForeignKey): The user (CustomUser) who applied for the job.
    - job_site_id (ForeignKey): The job site (JobSite) where the job is listed.
    - company_name (CharField): Name of the company offering the job.
    - posting_title (CharField): Title of the job posting.
    - posting_status (CharField): Current status of the application.
    - posting_url_full (CharField): Full URL of the job posting.
    - posting_url_domain (CharField): Short domain name or URL of the job site.
    - posting_password (CharField): Optional password for accessing the job posting.
    - pay_range (CharField): Salary range listed in the job posting.
    - location_type (CharField): Type of work location (e.g., remote, hybrid, on-site).
    - location_city (CharField): City where the job is located.
    - employment_type (CharField): Type of employment (e.g., full-time, part-time, contract).
    - applied_at (DateTimeField): Timestamp when the user applied to the job.
    - interviewed_at (DateTimeField): Timestamp when the user was interviewed.
    - rejected_at (DateTimeField): Timestamp when the user was rejected.
    - rejected_after_stage (CharField): Stage after which the user was rejected.
    - job_scan_info (CharField): Metadata or scan info related to the job posting.
    - outreach_info (CharField): Information about outreach efforts for this posting.
    - time_spent (IntegerField): Time spent on job application or preparation (in minutes).
    - technology_string (CharField): String summarizing required technologies.
    - technology_stack (JSONField): JSON list of technologies required for the job.
    - comments (JSONField): JSON list of user comments about the posting.
    - posting_application_questions (JSONField): JSON list of application questions.
    - job_description (TextField): Full job description.

Indexes:
    - (user): Optimizes queries filtering by user.
    - (job_site_id): Improves lookup performance for job sites.

Methods:
    - __str__(): Returns the job posting title as a string representation.
"""

from datetime import datetime
from typing import Type
from django.db import models
from job_search.models import CustomUser
from job_search.job_site.job_site import JobSite

class JobPosting(models.Model):
    """
    JobPosting represents a job listing that a user applies to via a job site.

    Fields:
        user (ForeignKey): A reference to the CustomUser who applied for the job.
        job_site_id (ForeignKey): The job site (JobSite) where the posting is listed.
        company_name (CharField): The name of the company offering the job.
        posting_title (CharField): The title of the job posting.
        posting_status (CharField): The current status of the application (e.g., applied, rejected, etc.).

        posting_url_full (CharField): The full URL of the job posting.
        posting_url_domain (CharField): The domain or short URL of the job site.
        posting_password (CharField): Optional password for accessing the job posting.

        pay_range (CharField): The pay range specified in the job posting.
        location_type (CharField): The type of work location (e.g., remote, hybrid, on-site).
        location_city (CharField): The city where the job is located.
        employment_type (CharField): The type of employment (e.g., full-time, part-time, contract).

        applied_at (DateTimeField): The date and time the user applied to the job.
        interviewed_at (DateTimeField): The date and time of an interview, if applicable.
        rejected_at (DateTimeField): The date and time the user was rejected, if applicable.
        rejected_after_stage (CharField): The stage after which the user was rejected.

        job_scan_info (CharField): Metadata or scan info related to the job posting.
        outreach_info (CharField): Information on any outreach performed for this posting.
        time_spent (IntegerField): The time spent on applying or preparing for the job, in minutes.

        technology_string (CharField): A string summarizing the technology requirements.
        technology_stack (JSONField): A JSON array of the technologies required for the job.
        comments (JSONField): A JSON array of user comments related to the posting.
        posting_application_questions (JSONField): A JSON array of application questions for the posting.
        job_description (TextField): The full description of the job posting.
        
        Indexes:
        - (user): Optimizes queries filtering by user.
        - (job_site_id): Improves lookup performance for job sites.
        - (id) (automatically indexed): The primary key for fast lookups.
    """
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE,
        null=True,
    )
    job_site_id = models.ForeignKey(JobSite, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=128, default='')
    posting_title = models.CharField(max_length=128, default='')
    posting_status = models.CharField(max_length=32, default='')

    posting_url_full = models.CharField(max_length=2048, default='')
    posting_url_domain = models.CharField(max_length=32, default='')
    posting_password = models.CharField(max_length=32, default='', blank=True, null=True)

    pay_range = models.CharField(max_length=256, default='')
    location_type = models.CharField(max_length=32, default='')
    location_city = models.CharField(max_length=64, default='')
    employment_type = models.CharField(max_length=32, default='')

    applied_at = models.DateTimeField(default=datetime.now)
    interviewed_at = models.DateTimeField(blank=True, null=True)
    rejected_at = models.DateTimeField(blank=True, null=True)
    rejected_after_stage = models.CharField(max_length=32, default='')

    job_scan_info = models.CharField(max_length=64, default='', blank=True, null=True)
    outreach_info = models.CharField(max_length=64, default='', blank=True, null=True)
    time_spent = models.IntegerField(default='', blank=True, null=True)

    technology_string = models.CharField(max_length=512, default='', blank=True)
    technology_stack = models.JSONField(default=list, blank=True, null=True)
    comments = models.JSONField(default=list, blank=True, null=True)
    posting_application_questions = models.JSONField(default=list, blank=True, null=True)
    job_description = models.TextField()

    # Explicitly define the manager type for linters
    objects: Type[models.Manager] = models.Manager()

    class Meta:
        indexes = [
            models.Index(fields=["user"]),  # Index on user for faster queries by user
            models.Index(fields=["job_site_id"]),  # Index on job site for filtering by site
        ]

    def _str_(self):
        return self.posting_title

