from rest_framework import serializers
from .models import *

class EmailOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailOpportunity
        fields = '__all__'

class EmailOpportunityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailOpportunity
        fields = ('id', 'recruiter_name', 'job_title', 'opportunity_status', 'email_received_at')

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

class JobPostingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = ('id', 'company_name', 'posting_title', 'posting_status', 
                  'rejected_after_stage', 'applied_at', 'rejected_at')

class DashboardStatisticsSerializer(serializers.Serializer):
    total_count = serializers.IntegerField()
    response_count = serializers.IntegerField()
    raw_date = serializers.DateField()
    formatted_date = serializers.CharField()

    def to_representation(self, instance):
        # Ensure `raw_date` field is formatted as expected
        representation = super().to_representation(instance)
        if 'raw_date' in representation:
            representation['raw_date'] = datetime.strptime(representation['raw_date'], '%Y-%m-%d').date()
        return representation


class ReportJobPostingSerializer(serializers.Serializer):
    report_name = serializers.CharField(max_length=255)
    report_fields = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(max_length=255)
        )
    )
    report_data = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(max_length=255)
        )
    )
