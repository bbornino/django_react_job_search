from rest_framework import serializers
from job_search.job_site.job_site import JobSite

class JobSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSite
        fields = '__all__'

class JobSiteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSite
        fields = ('id', 'site_name', 'site_url', 'rating',
                  'last_visited_at', 'headline')
