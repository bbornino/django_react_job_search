from django.contrib import admin
from .models import EmailOpportunity

class EmailOpportunityAdmin(admin.ModelAdmin):
    list_display = ('recruiter_name', 'recruiter_company', 'job_title')
    
# Register your models here.
admin.site.register(EmailOpportunity, EmailOpportunityAdmin)
