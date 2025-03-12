"""
Serializers for the JobPosting model.

This module defines serializers for serializing and deserializing JobPosting
objects for various API views in a Django REST Framework (DRF) application.

Classes:
    - JobPostingSerializer: Serializes all fields of the JobPosting model.
    - JobPostingListSerializer: Serializes a subset of fields for listing job postings.
    - JobSitePostingsSerializer: Serializes job postings with relevant fields for job sites.
    - ReportJobPostingSerializer: Serializes reporting data including report name, fields, and data.
"""

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
