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

class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = '__all__'

