"""
This module defines the DashboardStatisticsSerializer, which provides a structured representation
of job posting statistics data for use in a dashboard.

The serializer processes and formats data related to job postings, including the total count of postings, 
the number of postings with responses, and the date information in both raw and formatted forms.

Attributes:
    total_count (IntegerField): The total number of job postings.
    response_count (IntegerField): The number of job postings with a response,
        excluding 'No Response' and 'Rejected' statuses.
    raw_date (DateField): The raw date input in YYYY-MM-DD format.
    formatted_date (CharField): A human-readable format of the date.

Methods:
    to_representation(instance):
        Converts the raw_date field from a string in YYYY-MM-DD format to a Python date object for accurate representation.
        
    create(validated_data):
        Raises NotImplementedError since object creation is not supported for this serializer.
"""

from datetime import datetime
from rest_framework import serializers


class DashboardStatisticsSerializer(serializers.Serializer):
    """
    Serializer for dashboard statistics, providing a structured representation
    of job posting statistics data.

    Attributes:
        total_count (IntegerField): Total number of job postings.
        response_count (IntegerField): Number of job postings with a response,
            excluding 'No Response' and 'Rejected' statuses.
        raw_date (DateField): The raw date input in YYYY-MM-DD format.
        formatted_date (CharField): The formatted date in a more human-readable format.

    Methods:
        to_representation(instance):
            Converts the raw_date field to a Python date object for accurate representation.
    """
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

    def create(self, validated_data):
        """
        Object creation is not supported for this serializer.

        Args:
            validated_data (dict): Validated data for object creation.

        Raises:
            NotImplementedError: Always, as object creation is not supported.
        """
        raise NotImplementedError("DashboardStatisticsSerializer does not support object creation.")
