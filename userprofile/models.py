from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User)
    google_access_token = models.CharField(max_length=255, blank=True, null=True)
    dropbox_access_token = models.CharField(max_length=255, blank=True, null=True)
