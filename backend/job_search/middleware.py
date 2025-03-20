"""
Django middleware to suppress logging for token refresh errors.

This file defines custom middleware for suppressing error logs related to token refresh issues. 
The middleware class `SuppressTokenErrorLoggingMiddleware` checks if the response indicates an error
for the token refresh endpoint and suppresses the logging of these specific errors.

Classes:
    SuppressTokenErrorLoggingMiddleware (MiddlewareMixin):
        Middleware that suppresses error logs for the token refresh endpoint (e.g., 500 errors).
"""

import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

# pylint: disable=too-few-public-methods
class SuppressTokenErrorLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to suppress error logs for token refresh issues.

    This middleware checks if the response contains a 500 error and if the request is 
    related to the token refresh endpoint (`/api/token/refresh/`). If both conditions are met,
    the error is suppressed by logging it at the `DEBUG` level and preventing it from being logged 
    as an error. This prevents excessive logging for token refresh errors.
    """

    def process_response(self, request, response):
        """
        Processes the response to suppress error logs for token refresh errors.

        If the response indicates a 500 error and the request path contains `/api/token/refresh/`,
        this method suppresses the error log by logging the event at the `DEBUG` level instead of 
        logging it as an error.

        Args:
            request: The HTTP request object.
            response: The HTTP response object.

        Returns:
            The modified response object.
        """
        if response.status_code == 500 and '/api/token/refresh/' in request.path:
            logger.debug("Suppressed 500 error for token refresh: %s", request.path)

        return response
