from rest_framework import serializers
from job_search.email_opportunity.email_opportunity import EmailOpportunity

class EmailOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailOpportunity
        fields = '__all__'

class EmailOpportunityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailOpportunity
        fields = ('id', 'recruiter_name', 'job_title', 'opportunity_status', 'email_received_at')
