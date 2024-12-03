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
    """Define the listing of all Job Sites for REST API"""
    if request.method == "GET":
        data = JobSite.objects.all()
        serializer = JobSiteListSerializer(data, context={"request": request}, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = JobSiteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def job_site_detail(request, pk):
    """For any particular Job Site, enable the get, put, and delete"""
    job_site = get_object_or_404(JobSite, pk=pk)

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
