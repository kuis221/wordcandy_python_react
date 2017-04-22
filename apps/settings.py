"""
Django settings for apps project.

Generated by 'django-admin startproject' using Django 1.9.12.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.9/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '89-ybjdlkb35kx+tm)*tt#^1306%ff^ztp05y+h!yj!(c9-dc2'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sites',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'webpack_loader',
    'corsheaders',
    'main',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_auth.registration',
    'rest_framework_tracking',
    'allauth',
    'allauth.account',
    'rest_auth',
    'rest_framework_swagger',
    'djstripe',
    'api',
    'storages',
    'payment',
    'easy_thumbnails'
]

STRIPE_PUBLIC_KEY = os.environ.get("STRIPE_PUBLIC_KEY", "pk_live_T0LhQjr6GkIDIJYJc3xJrnYu")
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "sk_live_Y2V173ann7w9Z9HTxjN7CCps")

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'da4clbe9966ba3',
        'USER': 'ffsltlsfxfwxlb',
        'PASSWORD': '03b59a5077632d516ff5c55c8e81c668ce80e6c38380c8db88c3bdc03d7ead92',
        'HOST': 'ec2-23-21-220-188.compute-1.amazonaws.com',
        'PORT': '5432'
    }
}

ACCOUNT_EMAIL_VERIFICATION = 'none'

CORS_ORIGIN_ALLOW_ALL = True

MIDDLEWARE_CLASSES = [
    'apps.disable.DisableCSRF',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'no.reply.wordcandy@gmail.com'
EMAIL_HOST_PASSWORD = '729082wor'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = "Wordcandy <no.reply.wordcandy@gmail.com>"

ROOT_URLCONF = 'apps.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates'), ],
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

KEYWORDTOOL = '8665eeb58d9b5dfaf77eb3870688d1691fd31e5e'
MASHAPE = 'VE6YoZpJFSmshn2tK8ECH0xkHBN3p1DvUNJjsnqXhrdsZInLbz'

WSGI_APPLICATION = 'apps.wsgi.application'


# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

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
]

# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}

REST_SESSION_LOGIN = False

SITE_ID = 1

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': '/static/bundles/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json')
    }
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

STATIC_URL = '/static/'

AWS_STORAGE_BUCKET_NAME = "wordcandy"
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
THUMBNAIL_DEFAULT_STORAGE ='storages.backends.s3boto.S3BotoStorage'
THUMBNAIL_BASEDIR = '_miniaturas/'
AWS_S3_ROOT = 'https://s3-us-west-1.amazonaws.com/wordcandy/'
MEDIA_URL = 'https://{0}.s3.amazonaws.com/'.format('wordcandy')
MEDIA_ROOT = ''
AWS_ACCESS_KEY_ID = "AKIAIQBYGICC4NB4EYEQ"
AWS_SECRET_ACCESS_KEY = "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"

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

#STATICFILES_DIRS = [
#    os.path.join(BASE_DIR, 'static')
#]
