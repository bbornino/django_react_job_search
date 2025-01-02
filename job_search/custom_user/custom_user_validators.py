# custom_user_validators.py
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
