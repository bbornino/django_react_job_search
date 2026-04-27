"""
FILE: job_search/dashboard/dashboard_report.py
MODULE: dashboard

Defines configuration for dashboard reporting segments used to generate
time-based analytics and A/B comparison views in the dashboard.

Each segment represents a labeled time window used for grouping
job search performance metrics (e.g., overall performance, strategy-based
experiments like "Pathrise Method", or custom analysis periods).

This model is intentionally minimal to support flexible reporting
without hardcoding date ranges in code.
"""

from django.core.exceptions import ValidationError
from django.db import models
from job_search.models import CustomUser


class DashboardReportSegment(models.Model):
    """
    Represents a named time window used in dashboard analytics.

    Each segment defines a reporting range that is used to generate
    grouped statistics in the dashboard UI.

    Fields:
        name (CharField):
            Human-readable label for the segment
            (e.g., "Overall", "Pathrise Method")

        start_date (DateField):
            Inclusive start of the reporting window

        end_date (DateField):
            Optional inclusive end of the reporting window.
            If null, the segment represents all data after the start date.

    Notes:
        Segments are ordered chronologically by start_date to support
        sequential reporting views.
    """

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        null=True,
    )
    name = models.CharField(
        max_length=100, help_text="Short label (e.g., 'Overall', 'Pathrise Method')"
    )

    start_date = models.DateField(help_text="Start date (inclusive)")

    end_date = models.DateField(
        null=True,
        blank=True,
        help_text="Optional end date (leave blank for single-day stats)",
    )

    class Meta:
        db_table = "job_search_dashboard_report_segments"
        ordering = ["start_date"]

    def __str__(self):
        if self.end_date:
            return f"{self.name} ({self.start_date} → {self.end_date})"
        return f"{self.name} ({self.start_date})"

    def clean(self):
        if self.end_date and self.end_date < self.start_date:
            raise ValidationError("End date cannot be before start date.")
