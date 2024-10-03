from django.db import models
from datetime import datetime 
# Create your models here.

class EmailOpportunity(models.Model):
    job_title = models.CharField(max_length=128)
    opportunity_status = models.CharField(max_length=24)
    recruiter_name = models.CharField(max_length=64)
    recruiter_company = models.CharField(max_length=64)
    
    email_received_at = models.DateTimeField(default=datetime.now, blank=True)
    employment_type = models.CharField(max_length=24, default='')
    job_duration = models.CharField(max_length=64, default='')
    location_type = models.CharField(max_length=32, default='')
    location_city = models.CharField(max_length=64, default='')
    comments = models.JSONField(default=list)
    job_description = models.TextField(default='')

    def _str_(self):
        return self.job_title

class JobSite(models.Model):
    site_name = models.CharField(max_length=64, default='')
    site_url = models.CharField(max_length=64, default='')
    site_password = models.CharField(max_length=64, default='', blank=True)
    rating = models.IntegerField(default=1)

    resume_format = models.CharField(max_length=32, default='')
    github_field = models.BooleanField(default=False)
    project_site_field = models.BooleanField(default=False)
    last_visited_at = models.DateTimeField(default=datetime.now, blank=True)
    resume_updated_at = models.DateTimeField(default=datetime.now, blank=True)

    headline = models.CharField(max_length=64, default='')
    description = models.TextField()

    def _str_(self):
        return self.site_name

class JobPosting(models.Model):
    job_site_id = models.ForeignKey(JobSite, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=64, default='')
    posting_title = models.CharField(max_length=128, default='')
    posting_status = models.CharField(max_length=32, default='')
    
    posting_url_full = models.CharField(max_length=256, default='')
    posting_url_domain = models.CharField(max_length=32, default='')
    posting_password = models.CharField(max_length=32, default='')
    
    pay_range = models.CharField(max_length=64, default='')
    location_type = models.CharField(max_length=32, default='')
    location_city = models.CharField(max_length=64, default='')
    employment_type = models.CharField(max_length=32, default='')
    
    applied_at = models.DateTimeField(default=datetime.now, blank=True)
    interviewed_at = models.DateTimeField(default=datetime.now, blank=True)
    rejected_at = models.DateTimeField(default=datetime.now, blank=True)
    rejected_after_stage = models.CharField(max_length=32, default='')

    job_scan_info = models.CharField(max_length=64, default='')
    outreach_info = models.CharField(max_length=64, default='')

    technology_string = models.CharField(max_length=64, default='')
    technology_stack = models.JSONField(default=list)
    comments = models.JSONField(default=list)
    posting_application_questions = models.JSONField(default=list)
    job_description = models.TextField()

    def _str_(self):
        return self.posting_title
