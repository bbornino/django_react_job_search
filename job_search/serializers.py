from rest_framework import serializers
from .models import EmailOpportunity

class EmailOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailOpportunity
        fields = '__all__'
