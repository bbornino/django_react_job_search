from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from job_search.email_opportunity.email_opportunity import EmailOpportunity
from job_search.email_opportunity.email_opportunity_serializer import EmailOpportunitySerializer, EmailOpportunityListSerializer


@api_view(['GET', 'POST'])
def email_opportunity_list(request):
    """
    Handles GET and POST requests for the JobSite list.

    GET:
        - Retrieves a list of all JobSite objects.
        - Serializes the data and returns it in the response.

    POST:
        - Creates a new JobSite object based on the data provided in the request body.
        - Validates the request data using the JobSiteSerializer and saves it to the database.

    Parameters:
        request (HttpRequest): The HTTP request object containing the request data.

    Returns:
        Response:
            - For GET: Returns a list of serialized JobSite data.
            - For POST:
                - Returns a 201 Created status on successful creation of a JobSite.
                - Returns a 400 Bad Request status with validation errors if the request data is invalid.

    Raises:
        None
    """
    
    print(f"User Info: {request.user}")
    print(f"Is Authenticated: {request.user.is_authenticated}")
    print(f"User ID: {request.user.id}")
    print(f"User Username: {request.user.username}")

    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'GET':
        data = EmailOpportunity.objects.filter(user=request.user)
        serializer = EmailOpportunitySerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = EmailOpportunitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Pass the logged-in user to the save method
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def email_opportunity_detail(request, pk):
    """
    Retrieve, update, or delete a specific EmailOpportunity object.
    
    This function allows authenticated users to perform operations on a specific 
    EmailOpportunity object only if they are the owner of that opportunity.

    Args:
        request: The HTTP request object containing metadata about the request.
        pk (int): The primary key (ID) of the EmailOpportunity object to be accessed.

    Returns:
        Response: A Response object containing the serialized data or an error message.
    
    HTTP Methods:
        - GET: Returns the details of the specified EmailOpportunity.
        - PUT: Updates the specified EmailOpportunity with the provided data.
        - DELETE: Deletes the specified EmailOpportunity.

    Permissions:
        - Only the authenticated owner of the EmailOpportunity can access or modify it.

    Raises:
        HTTP_401_UNAUTHORIZED: If the user is not authenticated.
        HTTP_403_FORBIDDEN: If the user is not the owner of the EmailOpportunity.
        HTTP_404_NOT_FOUND: If the EmailOpportunity with the given ID does not exist.
    """
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    # Retrieve the EmailOpportunity and ensure the user is the owner
    email_opportunity = get_object_or_404(EmailOpportunity, pk=pk)
    if email_opportunity.user != request.user:
        return Response({"detail": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)

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
    """
    Retrieve all active EmailOpportunity objects for the authenticated user.

    This function filters out opportunities with excluded statuses and 
    ensures that only the opportunities associated with the authenticated 
    user are returned.

    Args:
        request: The HTTP request object containing metadata about the request.

    Returns:
        Response: A Response object containing a list of active EmailOpportunity 
                  objects or an error message.

    Permissions:
        - Only authenticated users can access this endpoint.
        - Users can only view opportunities they own.

    HTTP Status Codes:
        - 200 OK: Successfully retrieved active opportunities.
        - 401 Unauthorized: If the user is not authenticated.
    """
    # Debugging: Print request.user info to console
    print(f"email_opportunity_active User Info: {request.user}")
    print(f"email_opportunity_active Is Authenticated: {request.user.is_authenticated}")
    print(f"email_opportunity_active User ID: {request.user.id}")
    print(f"email_opportunity_active User Username: {request.user.username}")

    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."},
                        status=status.HTTP_401_UNAUTHORIZED)

    # Define statuses to exclude
    excluded_statuses = [
        '6 - Opportunity Ignored',
        '4 - Recruiter Ignored Interest',
        '2.7 - Right to Represent Ignored',
        '2.5 - Interviewed then Ignored',
        '2.3 - Rejected'
    ]

    # Filter opportunities for the authenticated user and exclude specified statuses
    data = EmailOpportunity.objects.filter(user=request.user).exclude(opportunity_status__in=excluded_statuses).values(
        'id', 'recruiter_name', 'job_title', 'opportunity_status', 'email_received_at'
    )

    serializer = EmailOpportunityListSerializer(data, context={'request': request}, many=True)
    return Response(serializer.data)
