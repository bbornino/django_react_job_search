# Utility Script to dump the database
# Windows 10 did not handle the UTF-8 correctly using a standard python manage.py datadump.
# Usage: python dumpdata_utf8.py

import sys
import os
import django
from django.core.management import call_command

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_react_job_search.settings')

# Initialize Django
django.setup()

# Ensure stdout uses UTF-8 encoding
sys.stdout.reconfigure(encoding='utf-8')

# Open the file to dump the data into
with open("data.json", "w", encoding="utf-8") as f:
    call_command("dumpdata", "--natural-primary", "--natural-foreign", "--indent", "2", stdout=f)
