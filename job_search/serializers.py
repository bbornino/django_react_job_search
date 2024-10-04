from rest_framework import serializers
from .models import *

class EmailOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailOpportunity
        fields = '__all__'

class JobSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSite
        fields = '__all__'

class JobSitePostingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = ('id', 'company_name', 'posting_title', 'posting_status', 'applied_at')

class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = '__all__'

