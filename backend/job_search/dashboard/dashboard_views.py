"""
FILE: job_search/dashboard/dashboard_views.py
MODULE: dashboard

This module defines views related to the dashboard, specifically for retrieving
dashboard statistics for authenticated users. The views process user-specific
statistics data and return it as a structured response.

The `dashboard_statistics` view handles the process of retrieving and returning
dashboard statistics, while the helper functions `getDashboardDateStatistics` and
`getDashboardDateRangeStatistics` execute raw SQL queries to gather job posting data
based on specific dates and date ranges.

Functions:
    dashboard_statistics(request):
        Retrieves dashboard statistics for the authenticated user.
        Returns a serialized response with statistics data or a 401 Unauthorized
            response if the user is not authenticated.

    getDashboardDateStatistics(request, startDate):
        Retrieves statistics for job postings after a specific start date.

    getDashboardDateRangeStatistics(request, startDate, endDate):
        Retrieves statistics for job postings between a specific start and end date.

Parameters:
    request (Request): The HTTP request object, containing user details and request data.
    startDate (str): A date in YYYY-MM-DD format to filter job postings.
    endDate (str, optional): A date in YYYY-MM-DD format to filter job postings. Default is None.

Returns:
    Response: A Response object containing serialized dashboard statistics data,
              with either a 200 OK or 204 No Content status.

Raises:
    None: This module does not raise exceptions directly but will return appropriate
          HTTP status codes for unauthenticated access or empty reports.
"""

from datetime import datetime
import logging
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.db import connection
from django.db.models import F
from job_search.dashboard.dashboard_serializer import (
    DashboardStatisticsSerializer,
    DashboardReportSegmentSerializer,
)
from job_search.dashboard.dashboard_report import DashboardReportSegment
from job_search.utils import dictfetchall

logger = logging.getLogger(__name__)  # Set up logging for this module


@api_view(["GET"])
def dashboard_statistics(request):
    """
    Retrieve dashboard statistics for the authenticated user.

    This view checks if the user is authenticated. If the user is not authenticated,
    it returns a 401 Unauthorized response. If the user is authenticated, it gathers
    date-specific dashboard statistics (hardcoded for "2024-03-01" and "2024-07-01") and
    returns them as a serialized response.

    Args:
        request (Request): The HTTP request object, containing the user details
                           and request data.

    Returns:
        Response: A Response object containing serialized dashboard statistics data.
                  The response will have a 200 OK status if the report data exists,
                  or a 204 No Content status if no report data is available.

    Raises:
        None: This view does not raise any exceptions directly, but will handle
              unauthenticated access by returning a 401 Unauthorized response.
    """
    logger.info(
        "User Info: %s",
        request.user.id if request.user.is_authenticated else "Anonymous",
    )
    logger.info("Is Authenticated: %s", request.user.is_authenticated)
    logger.info(
        "User ID: %s", request.user.id if request.user.is_authenticated else "N/A"
    )
    logger.info(
        "User Username: %s",
        request.user.username if request.user.is_authenticated else "N/A",
    )

    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    report = []

    segments = DashboardReportSegment.objects.filter(user=request.user).order_by(
        "start_date", F("end_date").asc(nulls_first=True)
    )
    print(f"Report segments: {segments}")

    for segment in segments:
        if segment.end_date:
            report.append(
                getDashboardDateRangeStatistics(
                    request,
                    segment.start_date.strftime("%Y-%m-%d"),
                    segment.end_date.strftime("%Y-%m-%d"),
                    label=segment.name,
                )
            )
        else:
            report.append(
                getDashboardDateStatistics(
                    request, segment.start_date.strftime("%Y-%m-%d"), label=segment.name
                )
            )

    # report.append(getDashboardDateStatistics(request, "2024-03-01"))
    # report.append(getDashboardDateRangeStatistics(request, "2024-03-01", "2024-07-01"))
    # report.append(getDashboardDateRangeStatistics(request, "2024-07-01", "2025-03-31"))
    # report.append(getDashboardDateRangeStatistics(request, "2025-03-31", "2025-08-31"))
    # report.append(getDashboardDateStatistics(request, "2025-11-01"))

    serialized_data = DashboardStatisticsSerializer(report, many=True).data
    return Response(
        serialized_data,
        status=status.HTTP_200_OK if report else status.HTTP_204_NO_CONTENT,
    )


def getDashboardDateStatistics(request, start_date, label=""):

    sql_query = """
            SELECT
                COUNT(*) AS total_count,
                COUNT(CASE
                    WHEN posting_status NOT IN ('4 - No Response', '3 - Rejected') THEN 1
                    ELSE NULL
                END) AS response_count
            FROM job_search_jobposting
            WHERE applied_at >= %s AND user_id = %s
        """
    with connection.cursor() as cursor:
        cursor.execute(sql_query, [start_date or "2024-01-01", request.user.id])
        report_data = dictfetchall(cursor)

    report_row = report_data[0]
    report_row["raw_date"] = start_date
    report_row["formatted_date"] = (
        datetime.strptime(start_date, "%Y-%m-%d").strftime("%B %d, %Y") + " to now"
    )
    report_row["label"] = label

    return report_row


def getDashboardDateRangeStatistics(request, start_date, end_date, label=""):

    sql_query = """
            SELECT
                COUNT(*) AS total_count,
                COUNT(CASE
                    WHEN posting_status NOT IN ('4 - No Response', '3 - Rejected') THEN 1
                    ELSE NULL
                END) AS response_count
            FROM job_search_jobposting
            WHERE applied_at BETWEEN %s AND %s AND user_id = %s
        """
    with connection.cursor() as cursor:
        cursor.execute(
            sql_query,
            [start_date or "2024-01-01", end_date or "2024-07-01", request.user.id],
        )
        report_data = dictfetchall(cursor)

    report_row = report_data[0]
    report_row["raw_date"] = start_date
    report_row["formatted_date"] = (
        datetime.strptime(start_date, "%Y-%m-%d").strftime("%B %d, %Y")
        + " to "
        + datetime.strptime(end_date, "%Y-%m-%d").strftime("%B %d, %Y")
    )
    report_row["label"] = label

    return report_row


@api_view(["GET", "POST", "PATCH", "DELETE"])
def dashboard_report_segments(request, pk=None):
    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if request.method == "POST":
        serializer = DashboardReportSegmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            logger.info("Dashboard report segment created: %s", serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.info("Failed to create dashboard report segment: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        # print(f"Deleting dashboard report segment for pk: {pk}")
        logger.info("Deleting dashboard report segment for pk: %s", pk)

        try:
            segment = DashboardReportSegment.objects.get(pk=pk, user=request.user)
        except DashboardReportSegment.DoesNotExist:
            # print(f"Dashboard report segment not found for pk: {pk}")
            logger.error("Dashboard report segment not found for pk: %s", pk)
            return Response(status=status.HTTP_404_NOT_FOUND)

        segment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == "PATCH":
        # print(f"Updating dashboard report segment for pk: {pk}")
        logger.info("Updating dashboard report segment for pk: %s", pk)
        try:
            segment = DashboardReportSegment.objects.get(pk=pk, user=request.user)
        except DashboardReportSegment.DoesNotExist:
            # print(f"Dashboard report segment not found for pk: {pk}")
            logger.error("Dashboard report segment not found for pk: %s", pk)
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = DashboardReportSegmentSerializer(
            segment, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            # print(f"Dashboard report segment updated for pk: {pk}")
            logger.info("Dashboard report segment updated for pk: %s", pk)
            return Response(serializer.data)

        # print(f"Dashboard report segment serializer not valid: {pk}")
        logger.error("Dashboard report segment serializer not valid for pk: %s", pk)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "GET":
        # print(f"Getting report segments for pk: {pk}")
        logger.info("Getting report segments for pk: %s", pk)

        if pk is not None:
            try:
                segment = DashboardReportSegment.objects.get(pk=pk, user=request.user)
            except DashboardReportSegment.DoesNotExist:
                # print(f"Dashboard report segment not found for pk: {pk}")
                logger.info("Dashboard report segment not found for pk: %s", pk)
                return Response(status=status.HTTP_404_NOT_FOUND)

            serializer = DashboardReportSegmentSerializer(segment)
            # print(f"Dashboard report segment retrieved for pk: {pk}")
            logger.info("Dashboard report segment retrieved: %s", serializer.data)
            return Response(serializer.data)

        segments = DashboardReportSegment.objects.filter(user=request.user).order_by(
            "start_date", F("end_date").asc(nulls_first=True)
        )
        serializer = DashboardReportSegmentSerializer(segments, many=True)
        # print(f"Retrieving all dashboard report segments: {serializer.data}")
        logger.info("Retrieving all dashboard report segments: %s", serializer.data)
        return Response(serializer.data)
