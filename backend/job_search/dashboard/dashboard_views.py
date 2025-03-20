"""
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
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.db import connection
from job_search.dashboard.dashboard_serializer import DashboardStatisticsSerializer
from job_search.utils import dictfetchall

@api_view(['GET'])
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
    print(f"User Info: {request.user}")
    print(f"Is Authenticated: {request.user.is_authenticated}")
    print(f"User ID: {request.user.id}")
    print(f"User Username: {request.user.username}")

    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."},
                        status=status.HTTP_401_UNAUTHORIZED)

    report = []
    report.append(getDashboardDateStatistics(request, "2024-03-01"))
    report.append(getDashboardDateRangeStatistics(request, "2024-03-01", "2024-07-01"))
    report.append(getDashboardDateStatistics(request, "2024-07-01"))

    serialized_data = DashboardStatisticsSerializer(report, many=True).data
    return Response(serialized_data, status=status.HTTP_200_OK if report else status.HTTP_204_NO_CONTENT)
    
def getDashboardDateStatistics(request, startDate):
    
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
        cursor.execute(sql_query, [startDate or '2024-01-01', request.user.id])
        report_data = dictfetchall(cursor)

    report_row = report_data[0]
    report_row['raw_date'] = startDate
    report_row['formatted_date'] = datetime.strptime(startDate, '%Y-%m-%d').strftime('%B %d, %Y')

    return report_row

def getDashboardDateRangeStatistics(request, startDate, endDate):
    
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
        cursor.execute(sql_query, [startDate or '2024-01-01', endDate or '2024-07-01', request.user.id])
        report_data = dictfetchall(cursor)

    report_row = report_data[0]
    report_row['raw_date'] = startDate
    report_row['formatted_date'] = datetime.strptime(startDate, '%Y-%m-%d').strftime('%B %d, %Y') + ' to ' + datetime.strptime(endDate, '%Y-%m-%d').strftime('%B %d, %Y')

    return report_row
