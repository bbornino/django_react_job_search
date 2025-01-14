from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from job_search.job_site.job_site import JobSite
from job_search.job_site.job_site_serializer import (
    JobSiteSerializer,
    JobSiteListSerializer,
)

@api_view(["GET", "POST"])
def job_site_list(request):
    """
    Handles GET and POST requests for listing and creating job sites.

    - For GET requests:
        Retrieves a list of JobSite objects associated with the authenticated user and
        returns the serialized data.

    - For POST requests:
        Accepts job site data, validates it, and saves a new JobSite object associated 
        with the authenticated user. Returns a success or error response based on the validation.

    Args:
        request: The HTTP request object containing user data, method, and any posted data.

    Returns:
        Response: A Response object with serialized data for GET requests or status codes 
                  for POST requests indicating success or failure.

    Raises:
        - Returns a 401 Unauthorized response if the user is not authenticated.
        - Returns a 400 Bad Request response if the POST data is invalid.

    Debugging:
        Prints user information to the console for debugging purposes (should be removed in production).
    """
    print(f"User Info: {request.user}")
    print(f"Is Authenticated: {request.user.is_authenticated}")
    print(f"User ID: {request.user.id}")
    print(f"User Username: {request.user.username}")
    
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        data = JobSite.objects.filter(user=request.user)
        serializer = JobSiteListSerializer(data, context={"request": request}, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = JobSiteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def job_site_detail(request, pk):
    """
    Handles GET, PUT, and DELETE requests for a specific job site based on its primary key (pk).

    - For GET requests:
        Retrieves a single JobSite object, serialized for the authenticated user.

    - For PUT requests:
        Updates an existing JobSite object with the provided data, ensuring the user is authorized 
        to modify the job site.

    - For DELETE requests:
        Deletes the specified JobSite object if the user is authorized.

    Args:
        request: The HTTP request object containing user data, method, and any posted data.
        pk: The primary key of the JobSite object to be retrieved, updated, or deleted.

    Returns:
        Response: A Response object with serialized data for GET requests, status codes for PUT and 
                  DELETE requests indicating success or failure.

    Raises:
        - Returns a 401 Unauthorized response if the user is not authenticated.
        - Returns a 403 Forbidden response if the user does not have permission to access or modify 
          the job site.
        - Returns a 400 Bad Request response if the PUT data is invalid.
        - Returns a 204 No Content response if the PUT or DELETE request is successful.

    Notes:
        - The user must be the owner of the JobSite to view, update, or delete it.
        - The PUT method expects the data for the job site to be passed in the request body.
        - The DELETE method removes the job site entirely from the database.

    Debugging:
        - This function performs authentication checks and authorization for each method.
    """

    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
    
    """For any particular Job Site, enable the get, put, and delete"""
    job_site = get_object_or_404(JobSite, pk=pk)
    if job_site.user != request.user:
        return Response({"detail": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        serializer = JobSiteSerializer(job_site, context={"request": request})
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = JobSiteSerializer(
            job_site, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        job_site.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
