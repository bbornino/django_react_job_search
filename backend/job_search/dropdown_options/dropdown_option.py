"""
FILE: job_search/dropdown_options/dropdown_option.py
MODULE: dropdown_option

Model for configurable dropdown options used across the application.

This module defines a generic, reusable table for storing selectable values
used in various frontend dropdowns (e.g., job posting forms, filters, and
configuration screens).

It replaces hardcoded select options in the UI with database-driven values,
allowing dynamic updates without frontend changes.

Classes:
    - DropdownOptionCategories: Defines constant category keys for grouping
      dropdown values across the system.
    - DropdownOption: Stores individual dropdown values, grouped by category,
      with ordering and active/inactive state support.
"""

from django.db import models


class DropdownOptionCategories:
    """
    Defines constant category keys used to group dropdown options.

    This class is not enforced at the database level but provides a
    centralized reference to avoid magic strings and reduce typos.

    Categories:
        - APPLICATION_SOURCE: Where a job application originated (e.g., LinkedIn, Indeed)
        - POSTING_STATUS: Status of a job application pipeline stage
        - EMPLOYMENT_TYPE: Type of employment (full-time, contract, etc.)
        - LOCATION_TYPE: Remote, hybrid, onsite classification
        - RECRUITMENT_STAGE: Stage of hiring process where rejection/decision occurred
    """

    APPLICATION_SOURCE = "application_source"
    POSTING_STATUS = "posting_status"
    EMPLOYMENT_TYPE = "employment_type"
    LOCATION_TYPE = "location_type"
    RECRUITMENT_STAGE = "recruitment_stage"

    CHOICES = [
        (APPLICATION_SOURCE, "Application Source"),
        (POSTING_STATUS, "Posting Status"),
        (EMPLOYMENT_TYPE, "Employment Type"),
        (LOCATION_TYPE, "Location Type"),
        (RECRUITMENT_STAGE, "Recruitment Stage"),
    ]


class DropdownOption(models.Model):
    """
    Generic model for storing dropdown/select options used across the system.

    Each record represents a selectable UI option belonging to a logical category.
    These values are used to dynamically populate frontend dropdowns without
    hardcoding values in the React application.

    Fields:
        category (CharField):
            Logical grouping of the dropdown option (see DropdownOptionCategories)

        name (CharField):
            Display label shown in the UI dropdown

        sort_order (FloatField):
            Determines ordering within a category.
            Lower values appear first. Supports fractional ordering (e.g., 2.5)

        is_active (BooleanField):
            Controls whether the option is available for selection in the UI.
            Inactive values are hidden but retained for historical integrity.
    """

    category = models.CharField(
        max_length=50,
        db_index=True,
        choices=DropdownOptionCategories.CHOICES,
        help_text="Logical grouping for dropdown values",
    )

    name = models.CharField(max_length=100, help_text="Display name shown in the UI")

    sort_order = models.FloatField(
        default=0, help_text="Controls display order (supports decimals like 2.5)"
    )

    is_active = models.BooleanField(
        default=True, help_text="Whether this option is selectable in the UI"
    )

    class Meta:
        db_table = "dropdown_options"
        ordering = ["sort_order", "id"]
        indexes = [
            models.Index(fields=["category", "is_active"]),
        ]
        verbose_name = "Dropdown Option"
        verbose_name_plural = "Dropdown Options"

    def __str__(self):
        return f"{self.category} - {self.name}"
