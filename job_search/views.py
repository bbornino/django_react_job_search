from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.utils import timezone
from django.db import connection
import pdb

from .models import *
from .serializers import *

@api_view(['GET', 'POST'])
def email_opportunity_list(request):
    """ Define the listing of all Email Oppportunities for REST API """
    if request.method == 'GET':
        data = EmailOpportunity.objects.all()
        serializer = EmailOpportunitySerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = EmailOpportunitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def email_opportunity_detail(request, pk):
    """ For any particular Email Oppportunity, enable the get, put, and delete """
    try:
        email_opportunity = EmailOpportunity.objects.get(pk=pk)
    except EmailOpportunity.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EmailOpportunitySerializer(email_opportunity, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = EmailOpportunitySerializer(email_opportunity, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        email_opportunity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def email_opportunity_active(request):
    excluded_statuses = ['6 - Opportunity Ignored', '4 - Recruiter Ignored Interest']
    data = EmailOpportunity.objects.exclude(opportunity_status__in=excluded_statuses).values('id', 'recruiter_name', 'job_title', 'opportunity_status', 'email_received_at')
    # pdb.set_trace()
    # print("Retrieved Data:", data)
    # return Response(status=status.HTTP_204_NO_CONTENT)
    serializer = EmailOpportunityListSerializer(data, context={'request': request}, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def job_site_list(request):
    """ Define the listing of all Job Sites for REST API """
    if request.method == 'GET':
        data = JobSite.objects.all()
        serializer = JobSiteSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = JobSiteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def job_site_detail(request, pk):
    """ For any particular Job Site, enable the get, put, and delete """
    try:
        job_site = JobSite.objects.get(pk=pk)
    except JobSite.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = JobSiteSerializer(job_site, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = JobSiteSerializer(job_site, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        job_site.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def job_site_postings(request, job_site_id):
    """ Define the listing of all Job Postings for REST API """
    if request.method == 'GET':
        data = JobPosting.objects.filter(job_site_id=job_site_id).values(
                    'id', 'company_name', 'posting_title', 'posting_status', 'applied_at')
        serializer = JobSitePostingsSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)


@api_view(['GET', 'POST'])
def job_posting_list(request):
    """ Define the listing of all Job Postings for REST API """
    if request.method == 'GET':
        data = JobPosting.objects.values('id', 'company_name', 'posting_title', 'posting_status', 
                  'rejected_after_stage', 'applied_at', 'rejected_at')
        serializer = JobPostingListSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = JobPostingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def job_posting_detail(request, pk):
    """ For any particular Job Posting, enable the get, put, and delete """
    try:
        job_posting = JobPosting.objects.get(pk=pk)
    except JobPosting.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = JobPostingSerializer(job_posting, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = JobPostingSerializer(job_posting, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        job_posting.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def postings_active(request):
    included_statuses = ['1 - Actively Engaged', '2 - Awaiting Feedback']
    # excluded_statuses = ['4 - No Response', '3 - Rejected']
    # or .exclude(posting_status__in=excluded_statuses)
    data = JobPosting.objects.filter(posting_status__in=included_statuses).values('id',
                                    'company_name', 'posting_title', 'posting_status', 
                                    'rejected_after_stage', 'applied_at', 'rejected_at')
    print(data)
    if not data:
        # print("There are no active postings")    
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        serializer = JobPostingListSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def dashboard_statistics(request):
    # if request.method == 'GET':
        # pdb.set_trace()
    report = []
    report.append(getDashboardDateStatistics("2024-03-01"))
    report.append(getDashboardDateStatistics("2024-07-01"))

    print("Final Report: ", report)
    return Response(report, status=status.HTTP_204_NO_CONTENT)
        
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



@api_view(['GET'])
def job_postings_report(request, report_type, reference_date=None):
    
    valid_report_types = ["postingsAppliedSince", "perSite", "perWeek"]
    if report_type not in valid_report_types:
        return Response(
            {"error": "Invalid report type. Valid types are: postingsAppliedSince, perSite, perWeek."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Initialize the reference date variable
    ref_date = None
    formatted_date = None
    # Handle reference date conversion
    if reference_date:
        try:
            ref_date = timezone.datetime.fromisoformat(reference_date)
            # formatted_date = ref_date.strftime('%B %d, %Y')     # easier to read.  Takes lots of space.
            formatted_date = ref_date.strftime('%m/%d/%y')
        except ValueError:
            return Response({"error": "Invalid date format."}, status=status.HTTP_400_BAD_REQUEST)
        
    # Initialize report metadata
    report_name = ""
    report_fields = []
    report_data = []

    # Determine which report to run
    if report_type == 'postingsAppliedSince':
        report_name = f"Postings Applied Since {formatted_date}" if reference_date else "Postings Applied Since"
        report_fields = [
            {"field_title": "Company Name", "field_name": "company_name", "sortable": True},
            {"field_title": "Posting Title", "field_name": "posting_title", "sortable": True},
            {"field_title": "Posting Status", "field_name": "posting_status", "sortable": True},
            {"field_title": "Applied At", "field_name": "applied_at", "sortable": True},
            {"field_title": "Rejected After Stage", "field_name": "rejected_after_stage", "sortable": True}
        ]

        sql_query = """
            SELECT p.id, p.company_name, p.posting_title, p.posting_status, p.applied_at, p.rejected_after_stage, s.site_name, s.id as site_id
            FROM job_search_jobposting p
            JOIN job_search_jobsite s ON p.job_site_id_id = s.id
            WHERE p.applied_at >= %s
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_query, [reference_date or '2024-01-01'])
            report_data = dictfetchall(cursor)
            
        # Loop to format the 'applied_at' field
        for record in report_data:
            applied_at = record.get('applied_at')
            # Format the date as 'Month Day, Year' (e.g., 'October 7, 2024')
            record['applied_at'] = datetime.strptime(str(applied_at), "%Y-%m-%d %H:%M:%S").strftime("%Y-%m-%d")

    elif report_type == 'perWeek':
        report_name = f"Applications Per Week {formatted_date}" if reference_date else "Applications Per Week"
        report_fields = [
            {"field_title": "Year", "field_name": "year", "sortable": False},
            {"field_title": "Month", "field_name": "month", "sortable": False},
            {"field_title": "Week", "field_name": "week", "sortable": False},
            {"field_title": "Week Count", "field_name": "week_count", "sortable": False}
        ]


        # Basic SQL query without date formatting
        sql_query = """
            SELECT 
                p.applied_at AS applied_at
            FROM job_search_jobposting p
            WHERE p.applied_at >= %s
            ORDER BY p.applied_at ASC
        """

        with connection.cursor() as cursor:
            cursor.execute(sql_query, [reference_date or '2024-01-01'])
            raw_data = dictfetchall(cursor)
            
        # Process the data in Python and format dates
        report_data = []
        week_count = {}

        for row in raw_data:
            # Convert applied_at to Python datetime object
            applied_at_dt = row['applied_at']

            # Extract the year, week number, and month from the date
            year = applied_at_dt.strftime("%Y")
            week = applied_at_dt.strftime("%W")
            month = applied_at_dt.strftime("%B")

            # Create a unique key for each year and week combination
            year_week_key = (year, week, month)

            # Update the week count for each unique year-week
            if year_week_key not in week_count:
                week_count[year_week_key] = 0
            week_count[year_week_key] += 1

        # Add the data to the report data
        for (year, week, month), count in week_count.items():
            report_data.append({
                "year": year,
                "week": week,
                "month": month,  # Since it's weekly, month is less relevant, but can be included
                "week_count": count
            })

    elif report_type == 'perSite':
        report_name = f"Postings Per Site {formatted_date}" if reference_date else "Postings Per Site"
        report_fields = [
            {"field_title": "Site Name", "field_name": "site_name", "sortable": True},
            {"field_title": "Site Count", "field_name": "site_count", "sortable": True}
        ]

        sql_query = """
            SELECT s.site_name, COUNT(p.id) AS site_count
            FROM job_search_jobposting p
            JOIN job_search_jobsite s ON p.job_site_id_id = s.id
            WHERE p.applied_at >= %s
            GROUP BY s.site_name
            ORDER BY site_count DESC
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_query, [reference_date or '2024-01-01'])
            report_data = dictfetchall(cursor)

    else:
        return Response({"error": "Invalid date format."}, status=status.HTTP_400_BAD_REQUEST)

    # Create a response dictionary
    response_data = {
        "report_name": report_name,
        "report_fields": report_fields,
        "report_data": report_data
    }

    # Serialize the response using ReportJobPostingSerializer
    serializer = ReportJobPostingSerializer(data=response_data)
    if serializer.is_valid():
        return Response(serializer.validated_data)
    return Response(response_data, status=status.HTTP_200_OK)


# Helper function to convert cursor data to a dictionary
def dictfetchall(cursor):
    "Return all rows from a cursor as a dictionary"
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]
