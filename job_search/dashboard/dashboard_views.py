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

