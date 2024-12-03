"""
URL configuration for django_react_job_search project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from job_search.dashboard.dashboard_views import dashboard_statistics
from job_search.email_opportunity.email_opportunity_views import (
    email_opportunity_list,
    email_opportunity_detail,
    email_opportunity_active,
)
from job_search.job_posting.job_posting_views import (
    postings_active,
    job_posting_list,
    job_site_postings,
    job_posting_detail,
    job_postings_report,
)
from job_search.job_site.job_site_views import (
    job_site_list,
    job_site_detail,
)


urlpatterns = [
    path('admin/', admin.site.urls),

    re_path(r'^api/email_opportunity/$', email_opportunity_list),
    re_path(r'^api/email_opportunity/([0-9]+)$', email_opportunity_detail),
    re_path(r'^api/email_opportunity/active/$', email_opportunity_active),

    re_path(r'^api/job_site/$', job_site_list),
    re_path(r'^api/job_site/([0-9]*)/postings', job_site_postings),
    re_path(r'^api/job_site/([0-9]*)', job_site_detail),

    re_path(r'^api/job_posting/active/$', postings_active),
    re_path(r'^api/job_posting/$', job_posting_list),

    re_path(r'^api/job_posting/([0-9]+)$', job_posting_detail),
    re_path(r'^api/report/(?P<report_type>\w+)/?(?P<reference_date>\d{4}-\d{2}-\d{2})?/?$', job_postings_report),
    re_path(r'^api/dashboard/$', dashboard_statistics),
]
