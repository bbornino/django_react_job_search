from datetime import datetime
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.utils import timezone
from django.db import connection
from django.shortcuts import get_object_or_404
from job_search.utils import dictfetchall
from job_search.job_site.job_site import JobSite
from job_search.job_posting.job_posting import JobPosting
from job_search.job_posting.job_posting_serializer import (
    JobPostingSerializer,
    JobPostingListSerializer,
    ReportJobPostingSerializer,
    JobSitePostingsSerializer,
)


@api_view(["GET"])
def job_site_postings(request, job_site_id):
    """
    Retrieves job postings associated with a specific job site, accessible only by the owner.

    - For GET requests:
        Fetches a list of job postings for the job site with the given job_site_id, ensuring the user 
        is authenticated and authorized to access the data.

    Args:
        request: The HTTP request object, containing user data, method, and any posted data.
        job_site_id: The ID of the job site whose associated job postings are to be retrieved.

    Returns:
        Response: A Response object containing a serialized list of job postings associated with 
                  the job site, or an error message if the user is unauthorized or the job posting 
                  is not found.

    Raises:
        - Returns a 401 Unauthorized response if the user is not authenticated.
        - Returns a 403 Forbidden response if the user does not have permission to access the job postings.
        - Returns a 404 Not Found response if no job posting exists for the provided job_site_id.
    
    Notes:
        - This view is read-only and only allows GET requests to fetch job postings.
        - The user must be the owner of the job posting to view the data.
        - The response data includes a filtered list of job postings, showing `id`, `company_name`, 
          `posting_title`, `posting_status`, and `applied_at` fields.
    
    Debugging:
        - The function ensures user authentication and authorization before retrieving job postings.
    """
    print(f"User Info: {request.user}")
    print(f"Is Authenticated: {request.user.is_authenticated}")
    print(f"User ID: {request.user.id}")
    print(f"User Username: {request.user.username}")
    
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    # Retrieve the Job Site to ensure that the user is the owner
    job_site = get_object_or_404(JobSite, pk=job_site_id)
    if job_site.user != request.user:
        return Response({"detail": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == "GET":
        data = JobPosting.objects.filter(job_site_id=job_site_id).values(
            "id", "company_name", "posting_title", "posting_status", "applied_at"
        )
        serializer = JobSitePostingsSerializer(
            data, context={"request": request}, many=True
        )
        return Response(serializer.data)


@api_view(["GET", "POST"])
def job_posting_list(request):
    """
    Handles GET and POST requests for job postings for an authenticated user.

    - For GET requests:
        Fetches a list of job postings for the authenticated user, including details such as the 
        company name, posting title, status, and other relevant information.

    - For POST requests:
        Creates a new job posting for the authenticated user based on the provided data.

    Args:
        request: The HTTP request object, containing user data, request method, and any posted data.

    Returns:
        Response: A Response object containing either:
            - A list of serialized job postings for GET requests, or
            - A status indicating the success or failure of the POST request (201 Created on success, 
              or 400 Bad Request with error details if the data is invalid).

    Raises:
        - Returns a 401 Unauthorized response if the user is not authenticated.
        - Returns a 400 Bad Request response if the data provided in the POST request is invalid.

    Notes:
        - GET requests retrieve job postings for the authenticated user, filtering them by the user.
        - POST requests allow the creation of a new job posting, linking it to the authenticated user.
        - The view prints debugging information about the authenticated user to the console (for debugging purposes).
    
    Debugging:
        - The function prints user information (e.g., user ID, username, authentication status) for debugging purposes.
    """
    
    print(f"User Info: {request.user}")
    print(f"Is Authenticated: {request.user.is_authenticated}")
    print(f"User ID: {request.user.id}")
    print(f"User Username: {request.user.username}")
    
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == "GET":
        data = JobPosting.objects.values(
            "id",
            "company_name",
            "posting_title",
            "posting_status",
            "rejected_after_stage",
            "applied_at",
            "rejected_at",
        ).filter(user=request.user)
        serializer = JobPostingListSerializer(
            data, context={"request": request}, many=True
        )
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = JobPostingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def job_posting_detail(request, pk):
    """
    Handles GET, PUT, and DELETE requests for a specific job posting for an authenticated user.

    - For GET requests:
        Retrieves the details of a specific job posting, provided the user is the owner of the job posting.

    - For PUT requests:
        Updates the details of a specific job posting, provided the user is the owner and the provided data is valid.

    - For DELETE requests:
        Deletes a specific job posting, provided the user is the owner.

    Args:
        request: The HTTP request object, containing user data, request method, and any posted data.
        pk: The primary key (ID) of the job posting to be retrieved, updated, or deleted.

    Returns:
        Response: A Response object containing either:
            - A serialized job posting for GET requests.
            - A status indicating the success or failure of the PUT or DELETE request (204 No Content on success, 
              or 400 Bad Request with error details if the data is invalid).

    Raises:
        - Returns a 401 Unauthorized response if the user is not authenticated.
        - Returns a 403 Forbidden response if the user does not own the job posting.
        - Returns a 400 Bad Request response if the PUT request data is invalid.

    Notes:
        - GET requests retrieve the job posting details for the authenticated user, checking ownership.
        - PUT requests allow the authenticated user to update their job posting.
        - DELETE requests allow the authenticated user to delete their job posting.

    """
    
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    job_posting = get_object_or_404(JobPosting, pk=pk)
    if job_posting.user != request.user:
        return Response({"detail": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        serializer = JobPostingSerializer(job_posting, context={"request": request})
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = JobPostingSerializer(
            job_posting, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        job_posting.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def postings_active(request):
    """
    Retrieves the active job postings for the authenticated user.

    Filters the job postings based on their status ('Actively Engaged' or 'Awaiting Feedback') 
    and ensures they belong to the authenticated user. If no active postings are found, 
    the response will return a status of HTTP 204 (No Content). Otherwise, it returns 
    a list of the active postings serialized for the response.

    Args:
        request: The HTTP request object containing user data and request parameters.

    Returns:
        Response: A Response object containing either a list of job postings or 
                  a status indicating no content found (HTTP 204).
    
    Raises:
        HTTP 401 Unauthorized: If the user is not authenticated.
    """
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."},
                        status=status.HTTP_401_UNAUTHORIZED)

    included_statuses = ["1 - Actively Engaged", "2 - Awaiting Feedback"]
    # excluded_statuses = ['4 - No Response', '3 - Rejected']
    # or .exclude(posting_status__in=excluded_statuses)
    data = JobPosting.objects.filter(
        posting_status__in=included_statuses, 
        user=request.user).values(
        "id",
        "company_name",
        "posting_title",
        "posting_status",
        "rejected_after_stage",
        "applied_at",
        "rejected_at",
    )
    print(data)
    if not data:
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        serializer = JobPostingListSerializer(
            data, context={"request": request}, many=True
        )
        return Response(serializer.data)


@api_view(["GET"])
def job_postings_report(request, report_type, reference_date=None):
    """
    Generate a report based on the specified report type and an optional reference date.

    This view function processes the request for various job posting reports:
    1. Postings Applied Since a specific date.
    2. Postings Per Site.
    3. Applications Per Week.

    The function ensures the user is authenticated and handles the report generation logic 
    by executing raw SQL queries and formatting the results based on the requested report type.

    Args:
        request (Request): The HTTP request object.
        report_type (str): The type of report to generate. Valid values are:
            - 'postingsAppliedSince': Report for postings applied since a reference date.
            - 'perSite': Report for the number of postings per site.
            - 'perWeek': Report for the number of applications per week.
        reference_date (str, optional): The reference date to filter the report. Should be in ISO format (YYYY-MM-DD). 
            If not provided, the report will not be date-filtered.

    Returns:
        Response: A Response object containing the generated report data.
            - Status 200: If the report is successfully generated.
            - Status 400: If the report type is invalid or if there's an issue with the date format.
            - Status 401: If the user is not authenticated.

    Example:
        GET /api/report/postingsAppliedSince/2024-02-01
        GET /api/report/perSite
        GET /api/report/perWeek/2024-01-01

    Raises:
        ValueError: If the reference_date is not in a valid ISO format.
    """

    # Debugging: Print request.user info to console
    print(f"job_postings_report User Info: {request.user}")
    print(f"job_postings_report Is Authenticated: {request.user.is_authenticated}")
    print(f"job_postings_report User ID: {request.user.id}")
    print(f"job_postings_report User Username: {request.user.username}")

     # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."},
                        status=status.HTTP_401_UNAUTHORIZED)

    valid_report_types = ["postingsAppliedSince", "perSite", "perWeek"]
    if report_type not in valid_report_types:
        return Response(
            {
                "error": "Invalid report type. Valid types are: postingsAppliedSince, perSite, perWeek."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Initialize the reference date variable
    ref_date = None
    formatted_date = None
    # Handle reference date conversion
    if reference_date:
        try:
            ref_date = timezone.datetime.fromisoformat(reference_date)
            # formatted_date = ref_date.strftime('%B %d, %Y')     # easier to read.  Takes lots of space.
            formatted_date = ref_date.strftime("%m/%d/%y")
        except ValueError:
            return Response(
                {"error": "Invalid date format."}, status=status.HTTP_400_BAD_REQUEST
            )

    # Initialize report metadata
    report_name = ""
    report_fields = []
    report_data = []

    # Determine which report to run
    if report_type == "postingsAppliedSince":
        report_name = (
            f"Postings Applied since {formatted_date}"
            if reference_date
            else "Postings Applied"
        )
        report_fields = [
            {
                "field_title": "Company Name",
                "field_name": "company_name",
                "sortable": True,
            },
            {
                "field_title": "Posting Title",
                "field_name": "posting_title",
                "sortable": True,
            },
            {
                "field_title": "Posting Status",
                "field_name": "posting_status",
                "sortable": True,
            },
            {"field_title": "Applied At", "field_name": "applied_at", "sortable": True},
            {
                "field_title": "Rejected After Stage",
                "field_name": "rejected_after_stage",
                "sortable": True,
            },
        ]

        sql_query = """
            SELECT p.id, p.company_name, p.posting_title, p.posting_status, p.applied_at, p.rejected_after_stage, s.site_name, s.id as site_id
            FROM job_search_jobposting p
            JOIN job_search_jobsite s ON p.job_site_id_id = s.id
            WHERE p.applied_at >= %s
            AND p.user_id = %s
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_query, [reference_date or "2024-01-01", request.user.id])
            report_data = dictfetchall(cursor)

        # Loop to format the 'applied_at' field
        for record in report_data:
            applied_at = record.get("applied_at")
            # Format the date as 'Month Day, Year' (e.g., 'October 7, 2024')
            record["applied_at"] = datetime.strptime(
                str(applied_at), "%Y-%m-%d %H:%M:%S"
            ).strftime("%Y-%m-%d")

    elif report_type == "perWeek":
        report_name = (
            f"Applications Per Week since {formatted_date}"
            if reference_date
            else "Applications Per Week"
        )
        report_fields = [
            {"field_title": "Year", "field_name": "year", "sortable": False},
            {"field_title": "Month", "field_name": "month", "sortable": False},
            {"field_title": "Week", "field_name": "week", "sortable": False},
            {
                "field_title": "Week Count",
                "field_name": "week_count",
                "sortable": False,
            },
        ]

        # Basic SQL query without date formatting
        sql_query = """
            SELECT 
                p.applied_at AS applied_at
            FROM job_search_jobposting p
            WHERE p.applied_at >= %s
            AND p.user_id = %s
            ORDER BY p.applied_at ASC
        """

        with connection.cursor() as cursor:
            cursor.execute(sql_query, [reference_date or "2024-01-01", request.user.id])
            raw_data = dictfetchall(cursor)

        # Process the data in Python and format dates
        report_data = []
        week_count = {}

        for row in raw_data:
            # Convert applied_at to Python datetime object
            applied_at_dt = row["applied_at"]

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
            report_data.append(
                {
                    "year": year,
                    "week": week,
                    "month": month,  # Since it's weekly, month is less relevant, but can be included
                    "week_count": count,
                }
            )

    elif report_type == "perSite":
        report_name = (
            f"Postings Per Site since {formatted_date}"
            if reference_date
            else "Postings Per Site"
        )
        report_fields = [
            {"field_title": "Site Name", "field_name": "site_name", "sortable": True},
            {"field_title": "Site Count", "field_name": "site_count", "sortable": True},
        ]

        sql_query = """
            SELECT s.site_name, COUNT(p.id) AS site_count
            FROM job_search_jobposting p
            JOIN job_search_jobsite s ON p.job_site_id_id = s.id
            WHERE p.applied_at >= %s AND p.user_id = %s
            GROUP BY s.site_name
            ORDER BY site_count DESC
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_query, [reference_date or "2024-01-01", request.user.id])
            report_data = dictfetchall(cursor)

    else:
        return Response(
            {"error": "Invalid date format."}, status=status.HTTP_400_BAD_REQUEST
        )

    # Create a response dictionary
    response_data = {
        "report_name": report_name,
        "report_fields": report_fields,
        "report_data": report_data,
    }

    # Serialize the response using ReportJobPostingSerializer
    serializer = ReportJobPostingSerializer(data=response_data)
    if serializer.is_valid():
        return Response(serializer.validated_data)
    return Response(response_data, status=status.HTTP_200_OK)
