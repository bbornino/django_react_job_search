"""
Views for handling JobSite-related API requests.

This module provides API endpoints for managing job sites, including listing,
retrieving, creating, updating, and deleting job sites. It supports caching
to optimize performance and logging for debugging.

Endpoints:
    - `job_site_list`: Handles listing job sites for the authenticated user
      and adding new job sites.
    - `job_site_detail`: Manages retrieving, updating, and deleting a specific
      job site.

Authentication:
    - All endpoints require user authentication.
    - Users can only access, modify, or delete their own job sites.

Caching:
    - GET requests utilize Django's caching framework to store job site data for
      one hour, reducing database queries and improving response times.

Logging:
    - Logs cache hits and misses.
    - Tracks API activity for debugging and monitoring.

Raises:
    - 401 Unauthorized: If the user is not authenticated.
    - 403 Forbidden: If the user attempts to access or modify another user's job site.
    - 400 Bad Request: If provided data is invalid during POST or PUT requests.
    - 204 No Content: If a PUT or DELETE request is successful.
"""

import logging
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.core.cache import cache

from job_search.job_site.job_site import JobSite
from job_search.job_site.job_site_serializer import (
    JobSiteSerializer,
    JobSiteListSerializer,
)

logger = logging.getLogger(__name__)  # Set up logging for this module

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
        Prints user information to the console for debugging purposes 
        (should be removed in production).
    """
    print(f"User Info: {request.user}")
    print(f"Is Authenticated: {request.user.is_authenticated}")
    print(f"User ID: {request.user.id}")
    print(f"User Username: {request.user.username}")

    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."},
                        status=status.HTTP_401_UNAUTHORIZED)

    cache_key = f"job_sites_{request.user.id}"  # Unique cache key per user
    logger.info("Checking cache for key: %s", cache_key)  # Log cache check

    if request.method == "GET":
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            logger.info("Cache hit - returning cached job site data.")  # Log cache hit
            return Response(cached_data)

        logger.info("Cache miss - querying database for job sites.")  # Log cache miss
        data = JobSite.objects.filter(user=request.user)
        serializer = JobSiteListSerializer(data, context={"request": request}, many=True)

        # ✅ Store data in cache
        cache.set(cache_key, serializer.data, timeout=3600)  # Cache for 1 hour
        logger.info("Cached job site data for key: %s", cache_key)

        return Response(serializer.data)

    elif request.method == "POST":
        serializer = JobSiteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)

            # Update the cache with the new data
            data = JobSite.objects.filter(user=request.user)
            updated_serializer = JobSiteListSerializer(data,
                                                       context={"request": request}, many=True)
            cache.set(cache_key, updated_serializer.data, timeout=3600)
            logger.info("Job site added - updated cache for key: %s", cache_key)

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
        return Response({"detail": "Authentication credentials were not provided."},
                        status=status.HTTP_401_UNAUTHORIZED)

    cache_key = f"job_site_{pk}"  # Unique cache key per job site
    logger.info("Checking cache for key: %s", cache_key)  # Log cache check

    job_site = get_object_or_404(JobSite, pk=pk)
    if job_site.user != request.user:
        return Response({"detail": "You do not have permission to access this resource."},
                        status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            logger.info("Cache hit - returning cached job site detail.")  # Log cache hit
            return Response(cached_data)

        logger.info("Cache miss - querying database for job site detail.")  # Log cache miss
        job_site = get_object_or_404(JobSite, pk=pk)
        if job_site.user != request.user:
            return Response({"detail": "You do not have permission to access this resource."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = JobSiteSerializer(job_site, context={"request": request})

        # Store data in cache for 1 hour (3600 seconds)
        cache.set(cache_key, serializer.data, timeout=3600)
        logger.info("Cached job site detail for key: %s", cache_key)

        return Response(serializer.data)

    elif request.method == "PUT":
        job_site = get_object_or_404(JobSite, pk=pk)
        if job_site.user != request.user:
            return Response({"detail": "You do not have permission to access this resource."},
                                status=status.HTTP_403_FORBIDDEN)

        serializer = JobSiteSerializer(job_site, data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()

            # Update the cache with the updated job site data
            updated_serializer = JobSiteSerializer(job_site, context={"request": request})
            cache.set(cache_key, updated_serializer.data, timeout=3600)
            logger.info("Job site updated - updated cache for key: %s", cache_key)

            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        job_site = get_object_or_404(JobSite, pk=pk)
        if job_site.user != request.user:
            return Response({"detail": "You do not have permission to access this resource."},
                            status=status.HTTP_403_FORBIDDEN)

        job_site.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
