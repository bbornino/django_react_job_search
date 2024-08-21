from django.contrib import admin
from .models import EmailOpportunity, JobSite, JobPosting

class EmailOpportunityAdmin(admin.ModelAdmin):
    list_display = ('recruiter_name', 'recruiter_company', 'job_title')
    
class JobSiteAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'rating', 'headline')

class JobPostingAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'posting_title', 'location_type')

# Register your models here.
admin.site.register(EmailOpportunity, EmailOpportunityAdmin)
admin.site.register(JobSite, JobSiteAdmin)
admin.site.register(JobPosting, JobPostingAdmin)
