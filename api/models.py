from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

from jsonfield import JSONField
from easy_thumbnails.fields import ThumbnailerImageField


class Subscribe(models.Model):
    email = models.EmailField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.email


class Shop(models.Model):
    name = models.CharField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name


class Export(models.Model):
    user = models.ForeignKey(User, blank=True, null=True)
    photo = ThumbnailerImageField(upload_to='photo', blank=True, null=True)
    title = models.CharField(max_length=512, blank=True)
    description = models.CharField(max_length=512, blank=True)
    tags = models.CharField(max_length=512, blank=True)
    keywords = models.CharField(max_length=512, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.keywords


class Template(models.Model):
    user = models.ForeignKey(User, blank=True, null=True)
    shop = models.ForeignKey(Shop)
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=255, blank=True)
    sort = models.IntegerField(default=0)
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(max_length=255, blank=True)
    tags = models.CharField(max_length=255, blank=True)
    main_tags = models.CharField(max_length=255, blank=True)
    default= models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.title


class Word(models.Model):
    name = models.CharField(max_length=512)
    results = JSONField()
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name
