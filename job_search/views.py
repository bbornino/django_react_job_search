from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

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


@api_view(['GET', 'POST'])
def job_posting_list(request):
    """ Define the listing of all Job Postings for REST API """
    if request.method == 'GET':
        data = JobPosting.objects.all()
        serializer = JobPostingSerializer(data, context={'request': request}, many=True)
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
