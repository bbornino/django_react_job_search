"""
Serializers for the JobSite model.

This module defines serializers for the `JobSite` model, used to convert 
database objects into JSON representations and vice versa.

Classes:
    - JobSiteSerializer: Serializes all fields of the `JobSite` model.
    - JobSiteListSerializer: Provides a lightweight serialization 
      with selected fields for listing job sites.

Example Usage:
    serializer = JobSiteSerializer(instance=job_site)
    serialized_data = serializer.data
"""
from rest_framework import serializers
from job_search.job_site.job_site import JobSite

class JobSiteSerializer(serializers.ModelSerializer):
    """
    Serializer for the `JobSite` model to convert it into a JSON representation.

    This serializer includes all fields from the `JobSite` model, enabling 
    conversion of the full model object to and from JSON format.

    Fields:
        - All fields from the `JobSite` model.
    """
    class Meta:
        model = JobSite
        fields = '__all__'

class JobSiteListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing `JobSite` instances with selected fields.

    This lightweight serializer includes only specific fields that are 
    relevant for listing job sites, rather than serializing the full model.

    Fields:
        - id (IntegerField): Unique identifier for the job site.
        - site_name (CharField): Name of the job site.
        - site_url (CharField): URL of the job site.
        - rating (IntegerField): Rating of the job site.
        - last_visited_at (DateTimeField): Timestamp of when the site was last visited.
        - headline (CharField): Custom headline associated with the job site.
    """
    class Meta:
        model = JobSite
        fields = ('id', 'site_name', 'site_url', 'rating',
                  'last_visited_at', 'headline')
