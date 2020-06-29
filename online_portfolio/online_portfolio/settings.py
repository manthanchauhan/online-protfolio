"""
Django settings for online_portfolio project.

Generated by 'django-admin startproject' using Django 3.0.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

from decouple import config
import os
import mimetypes

mimetypes.add_type("text/css", ".css", True)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "fp&8nwualuv*(q96=9fu^+$or9-4l-7ld7ev(!0pm%7h=8y6&9"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "accounts",
    "portfolio",
    "storages",
    "phonenumber_field",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "online_portfolio.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates"),],
        "APP_DIRS": False,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "online_portfolio.wsgi.application"


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "portfolio",
        "USER": "portfolio",
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": "localhost",
        "PORT": "",
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",},
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Email settings
EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USER = "pythonic913@gmail.com"
EMAIL_HOST_PASSWORD = config("EMAIL_PASSWORD")
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# Login settings
LOGIN_REDIRECT_URL = "/portfolio/edit/"
LOGOUT_REDIRECT_URL = "/accounts/login"

# static files (Amazon S3) configuration
AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY")
AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = "online-portfolio123"
AWS_DEFAULT_ACL = None
AWS_S3_CUSTOM_DOMAIN = AWS_STORAGE_BUCKET_NAME + ".s3.amazonaws.com"

AWS_S3_OBJECT_PARAMETERS = {
    "CacheControl": "max-age=86400",
}

AWS_LOCATION = "static"

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/
STATIC_URL = "https://" + AWS_S3_CUSTOM_DOMAIN + "/" + AWS_LOCATION + "/"
STATICFILES_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

# this is from where, django wills serve files
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

# STATIC_URL = "/static/"


# phone number setup
PHONENUMBER_DB_FORMAT = "INTERNATIONAL"

# user uploaded files
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"
DEFAULT_FILE_STORAGE = "online_portfolio.classes.MediaStorage"

# app functionality settings
DEFAULT_BASIC_INFO = {
    "name": "Manthan Chauhan",
    "about": "Lorem Ipsum is simply dummy text of the **printing** and *typesetting* industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
    "tag_line": "Django Developer & Competitive Programmer",
    "profile_pic": "https://online-portfolio123.s3.ap-south-1.amazonaws.com/static/portfolio/avatar.png",
}

DEFAULT_PROJECT = {
    "title": "Project Title",
    "description": "Project Description",
    "skills": "Skills Utilized",
    "image": "https://online-portfolio123.s3.ap-south-1.amazonaws.com/static/portfolio/763856+(1).jpg",
}
DEFAULT_USER = "manthanchauhan913@gmail.com"
