from django.db import models

# Create your models here.

class EmailOpportunity(models.Model):
    recruiter_name = models.CharField(max_length=64)
    recruiter_company = models.CharField(max_length=64)
    job_title = models.CharField(max_length=128)
    opportunity_status = models.CharField(max_length=24)
    job_description = models.TextField()

    def _str_(self):
        return self.job_title
