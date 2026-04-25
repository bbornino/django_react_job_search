from rest_framework import serializers
from job_search.dropdown_options.dropdown_option import DropdownOption


class DropdownOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DropdownOption
        fields = ["id", "name", "sort_order", "category", "is_active"]
