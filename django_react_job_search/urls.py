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
from job_search import views



urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^api/email_opportunity/$', views.email_opportunity_list),
    re_path(r'^api/email_opportunity/([0-9])$', views.email_opportunity_detail),
    re_path(r'^api/job_site/$', views.job_site_list),
    re_path(r'^api/job_site/([0-9])$', views.job_site_detail),
    re_path(r'^api/job_posting/$', views.job_site_list),
    re_path(r'^api/job_posting/([0-9])$', views.job_site_detail),
]
