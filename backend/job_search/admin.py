"""
Django Admin configurations for managing job search related models.

This file contains the admin interface configurations for models related to job search,
including `CustomUser`, `EmailOpportunity`, `JobSite`, and `JobPosting`. Each model has
its own configuration class, where specific fields to be displayed in the admin list view 
are defined.

Classes:
    CustomUserAdmin (admin.ModelAdmin):
        Configuration for the `CustomUser` model in the Django admin.
        Displays user-related information such as id, username, first name, last name, and email.

    EmailOpportunityAdmin (admin.ModelAdmin):
        Configuration for the `EmailOpportunity` model in the Django admin.
        Displays recruiter-related information such as recruiter name, recruiter company, and 
        job title.

    JobSiteAdmin (admin.ModelAdmin):
        Configuration for the `JobSite` model in the Django admin.
        Displays job site information like site name, rating, and headline.

    JobPostingAdmin (admin.ModelAdmin):
        Configuration for the `JobPosting` model in the Django admin.
        Displays job posting information such as company name, posting title, and location type.
"""

from django.contrib import admin
from job_search.models import CustomUser
from job_search.email_opportunity.email_opportunity import EmailOpportunity
from job_search.job_site.job_site import JobSite
from job_search.job_posting.job_posting import JobPosting

class CustomUserAdmin(admin.ModelAdmin):
    """
    Admin configuration for the `CustomUser` model.

    This class customizes the display of `CustomUser` model data in the Django admin
    interface. It shows a list of key fields for each user.
    """
    list_display = ('id', 'username', 'first_name', 'last_name', 'email')

class EmailOpportunityAdmin(admin.ModelAdmin):
    """
    Admin configuration for the `EmailOpportunity` model.

    This class customizes the display of `EmailOpportunity` model data in the Django admin
    interface. It shows important recruiter and job-related fields.
    """
    list_display = ('recruiter_name', 'recruiter_company', 'job_title')

class JobSiteAdmin(admin.ModelAdmin):
    """
    Admin configuration for the `JobSite` model.

    This class customizes the display of `JobSite` model data in the Django admin
    interface. It shows key job site details such as the name, rating, and headline.
    """
    list_display = ('site_name', 'rating', 'headline')

class JobPostingAdmin(admin.ModelAdmin):
    """
    Admin configuration for the `JobPosting` model.

    This class customizes the display of `JobPosting` model data in the Django admin
    interface. It shows relevant job posting information such as company name, posting title,
    and location type.
    """
    list_display = ('company_name', 'posting_title', 'location_type')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(EmailOpportunity, EmailOpportunityAdmin)
admin.site.register(JobSite, JobSiteAdmin)
admin.site.register(JobPosting, JobPostingAdmin)
