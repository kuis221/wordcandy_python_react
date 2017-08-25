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
DEBUG = False

SECURE_SSL_REDIRECT = True

ALLOWED_HOSTS = ['*']

ADMINS = [('Dmitry Kalinin', 'dmitry.kalinin.email@gmail.com'),]
MANAGERS = ADMINS


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
    'social_django',
    'social.apps.django_app.default',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.dropbox_oauth2',
    'allauth.socialaccount.providers.google',
    'rest_auth',
    'rest_framework_swagger',
    'djstripe',
    'payment',
    'api',
    'storages',
    'easy_thumbnails',
    'dashboard',
    'after_response',
]

SOCIALACCOUNT_EMAIL_VERIFICATION = False
SOCIALACCOUNT_EMAIL_REQUIRED = False
SOCIALACCOUNT_QUERY_EMAIL = False
ACCOUNT_UNIQUE_EMAIL = False

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    }
}

STRIPE_PUBLIC_KEY = os.environ.get("STRIPE_PUBLIC_KEY", "pk_live_cfDmcYe9P4O2Y04O85mnGhPJ")
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "sk_live_oqCbQMSyrLT5lefUoCdz7tiJ")


AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend'
)

DJSTRIPE_PLANS = {
    "WCHIGHTIERANNUAL": {
        "stripe_plan_id": "WCHIGHTIERANNUAL",
        "name": "WordCandy Prof Annual Plan ($690/year)",
        "description": "WordCandy Prof Annual Plan",
        "price": 69000,
        "currency": "usd",
        "interval": "year"
    },
    "WCHIGHTIERMONTHLY": {
        "stripe_plan_id": "WCHIGHTIERMONTHLY",
        "name": "WordCandy Prof Monthly Plan ($69/year)",
        "description": "WordCandy Prof Monthly Plan",
        "price": 6900,
        "currency": "usd",
        "interval": "month"
    },
    "WCLOWTIERANNUAL": {
        "stripe_plan_id": "WCLOWTIERANNUAL",
        "name": "WordCandy Beginner Annual Plan ($199.99/year)",
        "description": "WordCandy Beginner Annual Plan",
        "price": 19999,
        "currency": "usd",
        "interval": "year"
    },
    "WCLOWTIERMONTHLY": {
        "stripe_plan_id": "WCLOWTIERMONTHLY",
        "name": "WordCandy Beginner Monthly Plan ($19.99/month)",
        "description": "WordCandy Beginner",
        "price": 1999,
        "currency": "usd",
        "interval": "month"
    },
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'd1ips4r6hkk0r4',
        'USER': 'vhzrexiecjagan',
        'PASSWORD': '0ae59082b514ceb928221199243a02fbc753093a68c1978ba78e1023e7681053',
        'HOST': 'ec2-54-83-205-71.compute-1.amazonaws.com',
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
    'django.middleware.clickjacking.XFrameOptionsMiddleware'
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

KEYWORDTOOL = 'dd84201c2b4756a7435b43e5c224d2dc17c9ab02'
MASHAPE = 'VE6YoZpJFSmshn2tK8ECH0xkHBN3p1DvUNJjsnqXhrdsZInLbz'

TRADEMARK_USERNAME = 'rennbrooke'
TRADEMARK_PASSWORD = 'ZbYP7NdBrx'

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
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
}

REST_SESSION_LOGIN = True

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

AWS_STORAGE_BUCKET_NAME = "wordcandyapp"
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
THUMBNAIL_DEFAULT_STORAGE ='storages.backends.s3boto.S3BotoStorage'
THUMBNAIL_BASEDIR = '_miniaturas/'
AWS_S3_ROOT = 'https://s3-us-west-1.amazonaws.com/{0}/'.format(AWS_STORAGE_BUCKET_NAME)
MEDIA_URL = 'https://{0}.s3.amazonaws.com/'.format(AWS_STORAGE_BUCKET_NAME)
MEDIA_ROOT = ''
AWS_ACCESS_KEY_ID = "AKIAIBE4XD27K36VTS4Q"
AWS_SECRET_ACCESS_KEY = "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"

AMAZON_ACCESS_KEY = 'AKIAJTUR54KXVNE7S5PA'
AMAZON_SECRET_KEY = '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'
AMAZON_ASSOC_TAG = 'foorev-20'

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
#STATICFILES_DIRS = (BASE_DIR, 'static')
