"""
Django settings for django_react_job_search project.
"""

from pathlib import Path
import os
from datetime import timedelta
from dotenv import load_dotenv
from logging.handlers import TimedRotatingFileHandler

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Define log directory
LOG_DIR = BASE_DIR / "logs"

# Ensure the logs directory exists
os.makedirs(LOG_DIR, exist_ok=True)

# Load environment variables from .env explicitly
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Environment settings
DJANGO_ENV = os.getenv("DJANGO_ENV", "production")
ENABLE_AUTH = os.getenv("ENABLE_AUTH", "True") == "True"

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY", "your-default-secret-key")


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "False") == "True"

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'job_search'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'job_search.middleware.SuppressTokenErrorLoggingMiddleware', 
]

AUTH_USER_MODEL = 'job_search.CustomUser'

# CORS configuration
CORS_ORIGIN_ALLOW_ALL = os.getenv('CORS_ORIGIN_ALLOW_ALL', 'False') == 'True'
CORS_ALLOW_CREDENTIALS = os.getenv('CORS_ALLOW_CREDENTIALS', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')
CORS_ALLOW_HEADERS = [
  'authorization',
  'content-type',
  'x-refresh-token', 
]


# CORS settings based on CORS_ORIGIN_ALLOW_ALL
if CORS_ORIGIN_ALLOW_ALL:
    # Allow all origins (i.e., open CORS policy)
    CORS_ALLOWED_ORIGINS = []
else:
    # Use specific allowed origins
    # CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',')  #Generates a pylint error.  Use below instead.
    cors_origins = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')
    CORS_ALLOWED_ORIGINS = cors_origins.split(',')


ROOT_URLCONF = 'django_react_job_search.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'django_react_job_search.wsgi.application'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(hours=18),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': False,
}

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': {
        "ENGINE": os.getenv("DB_ENGINE", "django.db.backends.mysql"),  # Use MySQL engine for MariaDB compatibility
        'NAME': os.getenv('DB_NAME', 'django_job_search'),
        'USER': os.getenv('DB_USER', 'django_app'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'django_app'),
        'HOST': os.getenv('DB_HOST', 'localhost'), 
        'PORT': os.getenv('DB_PORT', '3306'),
        'OPTIONS': {
            'charset': 'utf8mb4',  # Set charset to utf8mb4 for better Unicode support
            'collation': 'utf8mb4_unicode_ci',  # Ensure the collation is utf8mb4-based
        },
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators
ENABLE_STRONG_PASSWORDS = os.getenv('ENABLE_STRONG_PASSWORDS', 'True') == 'True'
if ENABLE_STRONG_PASSWORDS:
    AUTH_PASSWORD_VALIDATORS = [
        {
            'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        },
        {
            'NAME': 'job_search.custom_user.custom_user_validators.StrongPasswordValidator',
        },
    ]
else:
    # Disable strong password validation if the flag is set to False
    AUTH_PASSWORD_VALIDATORS = []


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'America/Los_Angeles'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Authentication is 100% JWT-based (tokens in Authorization headers)
# Include below line to disable CSRF protection or simply omit
CSRF_TRUSTED_ORIGINS = []


# ==============================
# LOGGING CONFIGURATION
# ==============================
# Django logging setup that reads LOG_LEVEL from .env.
# Logs are stored in logs/django.log (ensure the 'logs/' directory exists).
# Adjust log level per environment: DEBUG (dev), INFO (staging), WARNING (prod).
LOG_LEVEL = os.getenv("LOG_LEVEL", "WARNING")  # Default to WARNING if not set

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "file": {
            "level": LOG_LEVEL,
            "class": "logging.handlers.TimedRotatingFileHandler",
            "filename": str(LOG_DIR / "django.log"), 
            "when": "midnight",  # Rotate logs at midnight
            "interval": 1,  # Rotate every 1 day
            'backupCount': 30,  # Keep the last 30 days of logs
            'formatter': 'verbose',
            'delay': True,

            # When the RotatingFileHandler is used without the delay option, it opens the log file
            # as soon as the logging configuration is loaded, even before any logging takes place.
            # This can result in the file being locked for the entire process, preventing log
            # rotation (or renaming of the log file) because the file is still being held open by
            # the logging handler.

            # By setting delay: True, the RotatingFileHandler delays the opening of the log file
            # until the first log message is written. This means the file is not immediately locked
            # by the handler when the application starts, and it allows log rotation to proceed
            # without any issues. Essentially, it avoids any conflicts between the log rotation
            # process and any other process or thread that may want to access the log file
            # (like Django’s development server, which could be holding the file open).

        },
        "console": {
            "level": LOG_LEVEL,
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
    },
    "root": {
        "handlers": ["file", "console"],
        "level": LOG_LEVEL,
    },
}
