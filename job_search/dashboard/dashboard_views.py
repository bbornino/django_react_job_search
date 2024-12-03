from datetime import datetime
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.db import connection
from job_search.dashboard.dashboard_serializer import DashboardStatisticsSerializer
from job_search.utils import dictfetchall

@api_view(['GET'])
def dashboard_statistics(request):
    report = []
    report.append(getDashboardDateStatistics("2024-03-01"))
    report.append(getDashboardDateStatistics("2024-07-01"))

    serialized_data = DashboardStatisticsSerializer(report, many=True).data
    return Response(serialized_data, status=status.HTTP_200_OK if report else status.HTTP_204_NO_CONTENT)
    
def getDashboardDateStatistics(startDate):
    sql_query = """
            SELECT
                COUNT(*) AS total_count,
                COUNT(CASE
                    WHEN posting_status NOT IN ('4 - No Response', '3 - Rejected') THEN 1
                    ELSE NULL
                END) AS response_count
            FROM job_search_jobposting
            WHERE applied_at >= %s
        """
    with connection.cursor() as cursor:
        cursor.execute(sql_query, [startDate or '2024-01-01'])
        report_data = dictfetchall(cursor)

    report_row = report_data[0]
    report_row['raw_date'] = startDate
    report_row['formatted_date'] = datetime.strptime(startDate, '%Y-%m-%d').strftime('%B %d, %Y')

    return report_row

