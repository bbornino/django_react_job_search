import os
from django.core.management import call_command
from io import StringIO
import django

# Set the settings module explicitly
os.environ['DJANGO_SETTINGS_MODULE'] = 'django_react_job_search.settings'  # Replace with your actual project name

# Initialize Django
django.setup()

def export_data():
    # Capture the dumpdata output with excluded tables
    output = StringIO()
    call_command('dumpdata', exclude=['auth.permission', 'contenttypes'], stdout=output)
    
    # Write the output to a file with UTF-8 encoding
    with open('db_export_cleaned.json', 'w', encoding='utf-8') as f:
        f.write(output.getvalue())

if __name__ == "__main__":
    export_data()
