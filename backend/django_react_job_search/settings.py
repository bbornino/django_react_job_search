"""
Django settings for django_react_job_search project.
"""

from pathlib import Path
import os
import environ
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize environment variables from .env file
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
# Optionally, for production, you can specify the file manually:
# environ.Env.read_env(os.path.join(BASE_DIR, '.env.production'))

DJANGO_ENV = env('DJANGO_ENV', default='production')

# Read the environment variable ENABLE_AUTH, default to True for production
ENABLE_AUTH = os.getenv('ENABLE_AUTH', 'True') == 'True'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-mgyu$=!%*u3=b&o9%(4m8)xul*4lj31bfpob%9*fvwkmp6)vxc'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

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
]

AUTH_USER_MODEL = 'job_search.CustomUser'

# CORS configuration
CORS_ORIGIN_ALLOW_ALL = env.bool('CORS_ORIGIN_ALLOW_ALL', False)
CORS_ALLOW_CREDENTIALS = env.bool('CORS_ALLOW_CREDENTIALS', True)
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost'])
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
    CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=['http://localhost:3000'])


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
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
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
        'ENGINE': 'django.db.backends.mysql',  # Use MySQL engine for MariaDB compatibility
        # 'NAME': 'django_job_search',  
        # 'USER': 'django_app', 
        # 'PASSWORD': 'django_app', 
        # 'HOST': 'localhost',
        # 'PORT': '3306',
        'NAME': os.getenv('DB_NAME', 'django_job_search'),
        'USER': os.getenv('DB_USER', 'django_app'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'django_app'),
        'HOST': os.getenv('DB_HOST', 'localhost'),  # Use 'db' in Docker
        'PORT': os.getenv('DB_PORT', '3306'),
        'OPTIONS': {
            'charset': 'utf8mb4',  # Set charset to utf8mb4 for better Unicode support
            'collation': 'utf8mb4_unicode_ci',  # Ensure the collation is utf8mb4-based
        },
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators
ENABLE_STRONG_PASSWORDS = env.bool('ENABLE_STRONG_PASSWORDS', default=True)
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
