from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.conf import settings
from django.shortcuts import get_object_or_404, render, redirect
from job_search.custom_user.custom_user_serializer import CustomUserSerializer, CustomUserListSerializer


@api_view(['POST'])
def authenticate_user(request):
    """Authenticate a user and log them in."""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user:
        # Create JWT token for the user
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        return Response({
            'access': str(access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def logout_user(request):
    """
    Log out by blacklisting the refresh token.
    """
    try:
        refresh_token = request.data.get('refresh')  # Get the refresh token from the request body
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token so it can't be used again
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "No refresh token provided."}, status=status.HTTP_400_BAD_REQUEST)
    except TokenError:
        return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_info(request):
    """Update the logged-in user's information."""
    user = request.user
    serializer = CustomUserSerializer(user, data=request.data, partial=True)  # Allow partial updates

    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User info updated successfully.'}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_all_users(request):
    """Retrieve a list of all users (admin access only)."""
    users = User.objects.all()
    serializer = CustomUserListSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
