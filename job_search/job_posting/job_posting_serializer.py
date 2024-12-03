from rest_framework import serializers
from job_search.job_posting.job_posting import JobPosting

class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = '__all__'

class JobPostingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = ('id', 'company_name', 'posting_title', 'posting_status',
                  'rejected_after_stage', 'applied_at', 'rejected_at')

class JobSitePostingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = ('id', 'company_name', 'posting_title', 'posting_status', 'applied_at')

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
