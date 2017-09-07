"""apps URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include, patterns
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from main.views import  IndexView, ResetPasswordView, RobotsView
from django.views.generic import RedirectView

admin.site.site_header = "WORDCANDY.IO"

from rest_framework_swagger.views import get_swagger_view

schema_view = get_swagger_view(title='WORDCANDY.IO API')

urlpatterns = [
    url(r'^$', IndexView.as_view(), name="index"),
    url(r'^0DFD5E3CED717C269E2CC5AE45CA6410.txt$', RobotsView.as_view(), name='robots'),
    url(r'^dashboard/$', IndexView.as_view(), name="dashboard"),
    url(r'^dashboard/$', IndexView.as_view(), name="home"),
    url(r'^sign-in/$', IndexView.as_view(), name="sign_in"),
    url(r'^sign-up/$', IndexView.as_view(), name="sign_up"),
    url(r'^profile/$', IndexView.as_view(), name="profile"),
    url(r'^synonyms-suggestions/$', IndexView.as_view(), name="synonyms"),
    url(r'^research-page/$', IndexView.as_view(), name="research-page"),
    url(r'^admin/', admin.site.urls),
    url(r'^docs/$', schema_view),
    url(r'^v1/', include('rest_auth.urls')),
    url(r'^v1/registration/', include('rest_auth.registration.urls')),
    url(r'^reset/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$', ResetPasswordView.as_view(), name='password_reset_confirm'),
    url(r'^reset/done/$', 'django.contrib.auth.views.password_reset_complete', {'template_name': 'index.html'}, name="password_reset_complete"),
    url(r'^v1/dashboard/', include('api.urls')),
    url(r'^payments/', include('djstripe.urls', namespace="djstripe")),
    url(r'^accounts/', include('allauth.urls', namespace='allauth')),
    url(r'^statistics/$', 'dashboard.views.statistics', name='statistics'),
]


urlpatterns += patterns('',
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {
        'document_root': settings.STATIC_ROOT,
    }),
)
