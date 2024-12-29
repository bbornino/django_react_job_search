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
from rest_framework_simplejwt.views import TokenObtainPairView
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
from job_search.custom_user.custom_user_views import (
    authenticate_user,
    TokenRefreshCustomView,
    UserProfileView,
    logout_user,
    update_user_info,
    list_all_users,
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

    # Custom User Endpoints
    path('api/auth/login/', authenticate_user, name='authenticate_user'),
    path('api/auth/logout/', logout_user, name='logout_user'),
    path('api/custom_user/update/', update_user_info, name='update_user_info'),
    path('api/custom_user/all/', list_all_users, name='list_all_users'),
    
    # Token obtain pair (login endpoint)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Token refresh endpoint
    path('api/token/refresh/', TokenRefreshCustomView.as_view(), name='token_refresh'),

    # "Me" endpoint to get current authenticated user data
    path('api/me/', UserProfileView.as_view(), name='user_profile'),
    
]
