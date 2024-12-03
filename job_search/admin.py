from django.contrib import admin
from job_search.email_opportunity.email_opportunity import EmailOpportunity
from job_search.job_site.job_site import JobSite
from job_search.job_posting.job_posting import JobPosting

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
