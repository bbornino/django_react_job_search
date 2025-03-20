"""
This module defines serializers for the `CustomUser` model, which is used to
convert `CustomUser` instances into JSON format and vice versa. It includes two
serializers: `CustomUserSerializer` and `CustomUserListSerializer`.

Classes:
    CustomUserSerializer(serializers.ModelSerializer):
        A serializer for the `CustomUser` model, including detailed user information.
        This serializer handles the conversion of a `CustomUser` instance to and from
        JSON format with all relevant fields.

    CustomUserListSerializer(serializers.ModelSerializer):
        A simplified serializer for listing `CustomUser` instances.
        This serializer includes basic user information, suitable for user lists.

Attributes:
    id (IntegerField): The unique identifier for the user.
    username (CharField): The username of the user.
    email (EmailField): The email address of the user.
    first_name (CharField): The user's first name.
    last_name (CharField): The user's last name.
    bio (TextField): A short biography of the user.
    user_greeting (CharField): A custom greeting message for the user.
    color_mode (CharField): The color mode preference (e.g., dark or light mode).
    dashboard_first_date (DateField): The first date for the user's dashboard statistics.
    dashboard_second_date (DateField): The second date for the user's dashboard statistics.

    Methods:
        None: These serializers only define fields for serializing and deserializing
              the `CustomUser` model. They do not include any additional custom methods.
"""

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

