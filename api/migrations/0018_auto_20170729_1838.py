# -*- coding: utf-8 -*-
# Generated by Django 1.9.13 on 2017-07-29 18:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_products'),
    ]

    operations = [
        migrations.AlterField(
            model_name='products',
            name='detail_page_url',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='products',
            name='small_image_url',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='products',
            name='title',
            field=models.CharField(max_length=512),
        ),
    ]
