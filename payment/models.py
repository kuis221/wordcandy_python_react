from __future__ import unicode_literals

from django.db.models.signals import post_save
from django.contrib.auth.models import User

from djstripe.settings import get_subscriber_model
from djstripe.models import Customer

def user_post_save(sender, instance, created, **kwargs):
    """Create a user profile when a new user account is created"""
    if created:
        for subscriber in get_subscriber_model().objects.filter(customer__isnull=True):
            Customer.get_or_create(subscriber=subscriber)
            print("Created subscriber for {0}".format(subscriber.email))

post_save.connect(user_post_save, sender=User)
