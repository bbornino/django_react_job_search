"""
Serializers for the EmailOpportunity model.

This module defines serializers for the EmailOpportunity model, which 
represents job opportunities received via email. These serializers 
handle data serialization and deserialization for API responses.

Classes:
    - EmailOpportunitySerializer: Serializes all fields of the EmailOpportunity model.
    - EmailOpportunityListSerializer: Serializes a subset of fields for list views.

Serializers:
    - EmailOpportunitySerializer:
        - Serializes all fields of the EmailOpportunity model.
    - EmailOpportunityListSerializer:
        - Fields:
            - id (int): Unique identifier for the email opportunity.
            - recruiter_name (str): Name of the recruiter or sender.
            - job_title (str): Title of the job being offered.
            - opportunity_status (str): Status of the opportunity (e.g., pending, declined).
            - email_received_at (datetime): Timestamp when the email was received.
"""

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
