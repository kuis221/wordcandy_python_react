# -*- coding: utf-8 -*-
# Generated by Django 1.9.13 on 2017-04-25 17:14
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20170425_1710'),
    ]

    operations = [
        migrations.RenameField(
            model_name='export',
            old_name='first_description',
            new_name='description',
        ),
        migrations.RenameField(
            model_name='export',
            old_name='product_name',
            new_name='tags',
        ),
        migrations.RenameField(
            model_name='export',
            old_name='second_description',
            new_name='title',
        ),
    ]