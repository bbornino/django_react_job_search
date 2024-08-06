from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import EmailOpportunity
from .serializers import *

@api_view(['GET', 'POST'])
def email_opportunity_list(request):
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
    try:
        emailOpportunity = EmailOpportunity.objects.get(pk=pk)
    except EmailOpportunity.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EmailOpportunitySerializer(emailOpportunity, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = EmailOpportunitySerializer(emailOpportunity, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        emailOpportunity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)