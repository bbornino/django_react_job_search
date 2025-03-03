import os
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.conf import settings
from job_search.models import CustomUser
from job_search.custom_user.custom_user_serializer import (
    CustomUserSerializer,
    CustomUserListSerializer,
)

# Set up logging
logger = logging.getLogger(__name__)

DJANGO_ENV = settings.DJANGO_ENV

@api_view(['POST'])
def authenticate_user(request):
    """
    Authenticate a user and provide JWT tokens upon successful login.

    Args:
        request (Request): The HTTP POST request containing 'username' and 'password' in the request body.

    Returns:
        Response: 
            - 200 OK: If authentication is successful, returns a dictionary with:
                - 'access': Access token (str).
                - 'refresh': Refresh token (str).
                - 'user': Serialized user data (dict) using the CustomUserSerializer.
            - 400 BAD REQUEST: If 'username' or 'password' is missing in the request data.
            - 401 UNAUTHORIZED: If the provided credentials are invalid.

    Raises:
        None

    Example:
        POST /api/authenticate_user/ 
        Request body:
        {
            "username": "testuser",
            "password": "password123"
        }
        Response:
        {
            "access": "eyJ0eXAiOiJKV1QiLCJh...",
            "refresh": "eyJhbGciOiJIUzI1NiIs...",
            "user": {
                "id": 1,
                "username": "testuser",
                "email": "testuser@example.com",
                ...
            }
        }
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user:
        # Create JWT token for the user
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
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
    Custom refresh token view for handling JWT token refreshes.

    This class extends SimpleJWT's built-in `TokenRefreshView` to provide
    additional error handling and customized responses for token refresh operations.

    Methods:
        post(request, *args, **kwargs):
            Handle POST requests to refresh JWT tokens.
            - On success: Calls the parent `TokenRefreshView.post` method.
            - On failure: Returns appropriate error messages and status codes.

    Args:
        request (Request): The HTTP POST request containing the refresh token in the body.

    Returns:
        Response:
            - 200 OK: If the refresh token is valid, returns a new access token and the original refresh token.
            - 401 UNAUTHORIZED: If the refresh token is invalid or expired.
            - 500 INTERNAL SERVER ERROR: For any unexpected server-side errors.

    Raises:
        None

    Example:
        POST /api/token/refresh/
        Request body:
        {
            "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        Response (on success):
        {
            "access": "eyJ0eXAiOiJKV1QiLCJh..."
        }
        Response (on failure):
        {
            "detail": "Token refresh failed. Please log in again."
        }
    """
    def post(self, request, *args, **kwargs):
        try:
            # Call the original TokenRefreshView's post method to handle refresh logic
            return super().post(request, *args, **kwargs)
        except TokenError:
            # Catch TokenError if the refresh token is invalid or expired
            logger.error("Token refresh failed: %s", str(e))
            return Response(
                {'detail': 'Token refresh failed. Please log in again.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            # General exception handling for any other errors
            logger.error("Unexpected error during token refresh: %s", str(e))
            return Response(
                {'detail': 'An unexpected error occurred during token refresh.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['POST'])
def logout_user(request):
    """
    Logs out a user by blacklisting their refresh token.

    This function handles the logout process for JWT-based authentication
    by blacklisting the provided refresh token, preventing further use.

    Args:
        request (Request): The HTTP POST request containing the 'refresh' token in the request body.

    Returns:
        Response:
            - 200 OK: If the refresh token is successfully blacklisted.
            - 400 BAD REQUEST: If no refresh token is provided or the token is invalid.

    Raises:
        None

    Example:
        POST /api/logout_user/
        Request body:
        {
            "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        Response (on success):
        {
            "detail": "Successfully logged out."
        }
        Response (on failure - no token):
        {
            "detail": "No refresh token provided."
        }
        Response (on failure - invalid token):
        {
            "detail": "Invalid token."
        }
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
    View to retrieve the current logged-in user's profile.

    This endpoint provides user-specific information, acting as a 'me' endpoint
    to fetch the details of the authenticated user.

    Attributes:
        permission_classes (list): List of permission classes that determine access to the view. 
                                   Requires the user to be authenticated (`IsAuthenticated`).

    Methods:
        get(request):
            Handle GET requests to return user profile details.

    Args:
        request (Request): The HTTP request object containing user authentication information.

    Returns:
        Response:
            - 200 OK: If the user is authenticated, returns a dictionary containing:
                - 'id': User ID (int)
                - 'username': Username (str)
                - 'email': Email address (str)
                - 'first_name': First name (str)
                - 'last_name': Last name (str)
    
    Raises:
        None

    Example:
        GET /api/user/profile/
        Response:
        {
            "id": 1,
            "username": "john_doe",
            "email": "john_doe@example.com",
            "first_name": "John",
            "last_name": "Doe"
        }
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
    """
    Update the logged-in user's information.

    This endpoint allows an authenticated user to update their profile information
    with partial updates supported.

    Args:
        request (Request): The HTTP PUT request containing the user's updated data in the request body.

    Returns:
        Response:
            - 200 OK: If the user information is successfully updated. Returns a success message.
            - 400 BAD REQUEST: If the provided data is invalid. Returns validation errors.

    Raises:
        None

    Example:
        PUT /api/user/update/
        Request body:
        {
            "first_name": "John",
            "last_name": "Doe",
            "email": "new_email@example.com"
        }
        Response (on success):
        {
            "message": "User info updated successfully."
        }
        Response (on failure):
        {
            "email": ["Enter a valid email address."]
        }
    """
    user = request.user
    serializer = CustomUserSerializer(user, data=request.data, partial=True)  # Allow partial updates

    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User info updated successfully.'}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_user(request):
    """
    Register a new user with basic and default information.

    This endpoint allows the creation of a new user with the following required fields:
    - `username`
    - `email`
    - `first_name`
    - `last_name`
    - `password`

    Optional fields are initialized to default values:
    - `bio`: ""
    - `user_greeting`: "Welcome!"
    - `color_mode`: "light"
    - `dashboard_first_date`: None
    - `dashboard_second_date`: None

    Args:
        request (Request): The HTTP POST request containing user registration data in the body.

    Returns:
        Response:
            - 201 CREATED: If the user is successfully registered. Returns a success message.
            - 400 BAD REQUEST: If required fields are missing, the username/email is already taken,
              or the password fails validation. Returns an error message.

    Raises:
        None

    Example:
        POST /api/register/
        Request body:
        {
            "username": "johndoe",
            "email": "johndoe@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "password": "StrongPassword123!"
        }
        Response (on success):
        {
            "message": "User successfully registered."
        }
        Response (on failure):
        {
            "error": "Username already exists."
        }
    """
    # Get the data from the request
    username = request.data.get('username')
    email = request.data.get('email')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    password = request.data.get('password')

    # Validate required fields
    if not username or not email or not first_name or not last_name or not password:
        return Response({'error': 'All fields are required: username, email, first_name, last_name, and password.'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Check if the username already exists
    if CustomUser.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    # Skip email check if in development environment
    print(f'DJANGO_ENV value: {os.environ.get("DJANGO_ENV")}')
    if DJANGO_ENV != 'development':
        # Check if the email already exists, skip for development
        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'Email address is already registered.'}, status=status.HTTP_400_BAD_REQUEST)


    try:
        # Validate password using Django's built-in password validators
        validate_password(password)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Set optional fields to default values
    bio = ""  # Default value for bio
    user_greeting = "Welcome!"  # Default greeting message
    color_mode = "light"  # Default color mode
    dashboard_first_date = None  # Default value for dashboard_first_date
    dashboard_second_date = None  # Default value for dashboard_second_date

    # Create the custom user (including required fields and default optional fields)
    user = CustomUser.objects.create_user(
        username=username,
        email=email,
        first_name=first_name,
        last_name=last_name,
        password=password,
        bio=bio,
        user_greeting=user_greeting,
        color_mode=color_mode,
        dashboard_first_date=dashboard_first_date,
        dashboard_second_date=dashboard_second_date
    )

    return Response({'message': 'User successfully registered.'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_all_users(request):
    """Retrieve a list of all users (admin access only)."""
    users = CustomUser.objects.all()
    serializer = CustomUserListSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)