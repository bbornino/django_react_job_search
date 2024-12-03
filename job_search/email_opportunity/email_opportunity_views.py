from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from job_search.email_opportunity.email_opportunity import EmailOpportunity
from job_search.email_opportunity.email_opportunity_serializer import EmailOpportunitySerializer, EmailOpportunityListSerializer


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
    email_opportunity = get_object_or_404(EmailOpportunity, pk=pk)

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
    excluded_statuses = ['6 - Opportunity Ignored', '4 - Recruiter Ignored Interest', '2.7 - Right to Represent Ignored', '2.5 - Interviewed then Ignored']
    data = EmailOpportunity.objects.exclude(opportunity_status__in=excluded_statuses).values('id', 'recruiter_name', 'job_title', 'opportunity_status', 'email_received_at')

    serializer = EmailOpportunityListSerializer(data, context={'request': request}, many=True)
    return Response(serializer.data)

