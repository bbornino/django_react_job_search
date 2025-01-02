from rest_framework import serializers
from job_search.models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.
    Converts the model instance into JSON and vice versa.
    """
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'bio', 
            'user_greeting', 'color_mode', 'dashboard_first_date', 'dashboard_second_date'
        ]

class CustomUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name'
        ]

