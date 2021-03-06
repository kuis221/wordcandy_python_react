# -*- coding: utf-8 -*-
# Generated by Django 1.9.13 on 2017-06-06 08:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20170503_1244'),
    ]

    operations = [
        migrations.AddField(
            model_name='shop',
            name='disabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='template',
            name='brand_name',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='template',
            name='description_first',
            field=models.TextField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='template',
            name='description_second',
            field=models.TextField(blank=True, max_length=255),
        ),
    ]
