from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
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

        # Serialize the user object using CustomUserSerializer (adjust fields as necessary)
        user_data = CustomUserSerializer(user).data

        # Return access token, refresh token, and serialized user data
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'user': user_data,  # Return the serialized user data
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)


class TokenRefreshCustomView(TokenRefreshView):
    """
    Custom refresh token view that can be used to refresh the JWT token.
    This uses SimpleJWT's built-in view.
    """


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


class UserProfileView(APIView):
    """
    A view to get the current logged-in user's profile.
    This is a 'me' endpoint to fetch the user details.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
        return Response(user_data, status=status.HTTP_200_OK)

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
