"""
This module contains custom validators for user input validation, specifically
focused on enforcing strong password rules.

Classes:
    StrongPasswordValidator:
        A validator that ensures passwords meet specific strength requirements,
        including length, character diversity (lowercase, uppercase, digit, and special characters),
        and a minimum length of 12 characters.

Attributes:
    regex (str): A regular expression pattern used to check the strength of the password.
    message (str): The message to be displayed when the password does not meet the strength requirements.

Methods:
    validate(password: str, user: Optional[CustomUser] = None):
        Validates the provided password against the strength requirements. If the password
        does not match the regex pattern, a `ValidationError` is raised.
    
    get_help_text() -> str:
        Returns the validation message explaining the password strength requirements.
"""

import re
from django.core.exceptions import ValidationError

# Matches the React Component Regex
strongPasswordRegex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z\d!@#$%^&*(),.?\":{}|<>]{12,}$"

class StrongPasswordValidator:
    def __init__(self):
        self.regex = strongPasswordRegex
        self.message = "Password must be at least 12 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character."

    def validate(self, password, user=None):
        if not re.match(self.regex, password):
            raise ValidationError(self.message)

    def get_help_text(self):
        return self.message
