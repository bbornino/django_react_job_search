from django.db import models
from datetime import datetime 
# Create your models here.

class EmailOpportunity(models.Model):
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

    def _str_(self):
        return self.job_title



class JobSite(models.Model):
    site_name = models.CharField(max_length=64, default='')
    site_url = models.CharField(max_length=64, default='')
    site_password = models.CharField(max_length=64, default='', blank=True, null=True)
    rating = models.IntegerField(default=1)

    resume_format = models.CharField(max_length=32, default='')
    github_field = models.BooleanField(default=False)
    project_site_field = models.BooleanField(default=False)
    last_visited_at = models.DateTimeField(default=datetime.now, blank=True)
    resume_updated_at = models.DateTimeField(default=datetime.now, blank=True)

    headline = models.CharField(max_length=64, default='')
    description = models.TextField(blank=True, null=True)

    def _str_(self):
        return self.site_name

class JobPosting(models.Model):
    job_site_id = models.ForeignKey(JobSite, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=64, default='')
    posting_title = models.CharField(max_length=128, default='')
    posting_status = models.CharField(max_length=32, default='')
    
    posting_url_full = models.CharField(max_length=1024, default='')
    posting_url_domain = models.CharField(max_length=32, default='')
    posting_password = models.CharField(max_length=32, default='', blank=True, null=True)
    
    pay_range = models.CharField(max_length=64, default='')
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

    technology_string = models.CharField(max_length=128, default='', blank=True)
    technology_stack = models.JSONField(default=list, blank=True)
    comments = models.JSONField(default=list, blank=True, null=True)
    posting_application_questions = models.JSONField(default=list, blank=True)
    job_description = models.TextField()

    def _str_(self):
        return self.posting_title

class UserSettings(models.Model):
    user_greeting = models.CharField(max_length=24)
    color_mode = models.CharField(max_length=24)
    dashboard_first_date = models.DateTimeField(default=datetime.now, blank=True)
    dashboard_second_date = models.DateTimeField(default=datetime.now, blank=True)
