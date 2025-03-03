import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

class SuppressTokenErrorLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to suppress error logs for token refresh issues.
    """
    def process_response(self, request, response):
        # Check if the error is related to the token refresh endpoint
        if response.status_code == 500 and '/api/token/refresh/' in request.path:
            # Suppress the logging for these specific errors
            logger.debug(f"Suppressed 500 error for token refresh: {request.path}")
            # Optionally modify the response here if you want to avoid any further impact
        return response
