from django.contrib.auth import get_user_model, authenticate
from django.conf import settings
from django.db.models import Q

from djstripe.models import Customer, CurrentSubscription
from djstripe.settings import subscriber_request_callback

from easy_thumbnails.files import get_thumbnailer
from rest_framework import serializers
from rest_framework_tracking.models import APIRequestLog

from api.models import Shop, Template, Subscribe, Export
from payment.models import Vip

from datetime import datetime


# Get the UserModel
UserModel = get_user_model()

class UserDetailsSerializer(serializers.ModelSerializer):
    """
    User model w/o password
    """
    vip = serializers.SerializerMethodField()
    active = serializers.SerializerMethodField()
    plan = serializers.SerializerMethodField()
    count = serializers.SerializerMethodField()


    def get_vip(self, obj):
        if Vip.objects.filter(user=obj):
            return True
        else:
            return False

    def get_plan(self, obj):

        if Vip.objects.filter(user=obj):
            return 'Founding LIFETIME Member'

        customer, created = Customer.get_or_create(subscriber=obj)
        try:
            subscription = customer.current_subscription
        except CurrentSubscription.DoesNotExist:
            return 'FREE Plan'

        if subscription.status != 'active' and subscription.status != 'trialing':
            return 'FREE Plan'

        return subscription.plan

    def get_active(self, obj):

        if Vip.objects.filter(user=obj):
            return True

        customer, created = Customer.get_or_create(subscriber=obj)
        try:
            subscription = customer.current_subscription
        except CurrentSubscription.DoesNotExist:
            return False

        if subscription.status != 'active' and subscription.status != 'trialing':
            return False

        return True


    def get_count(self, obj):
        default = 1
        plan = 200

        today = APIRequestLog.objects.filter(path='/v1/dashboard/keywordtool/', user=obj, requested_at__date=datetime.today()).count()

        if Vip.objects.filter(user=obj):
            return 1000

        customer, created = Customer.get_or_create(subscriber=obj)
        try:
            subscription = customer.current_subscription
        except CurrentSubscription.DoesNotExist:
            return default - today

        if subscription.status != 'active' and subscription.status != 'trialing':
            return default - today

        return plan - today


    class Meta:
        model = UserModel
        fields = ('pk', 'username', 'email', 'first_name', 'last_name', 'vip', 'active', 'plan', 'count')
        read_only_fields = ('email', )


class Base64ImageField(serializers.ImageField):
    """
    A Django REST framework field for handling image-uploads through raw post data.
    It uses base64 for encoding and decoding the contents of the file.

    Heavily based on
    https://github.com/tomchristie/django-rest-framework/pull/1268

    Updated for Django REST framework 3.
    """

    def to_internal_value(self, data):
        from django.core.files.base import ContentFile
        import base64
        import six
        import uuid

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:
                # Break out the header from the base64 content
                header, data = data.split(';base64,')

            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            # Generate file name:
            file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension, )

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension


class SynonymsSerializer(serializers.Serializer):
    word = serializers.CharField(max_length=255)


class AntonymsSerializer(serializers.Serializer):
    word = serializers.CharField(max_length=255)


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        exclude = ()


class SubscribeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subscribe
        exclude = ()


class ExportSerializer(serializers.ModelSerializer):
    photo = Base64ImageField(required=False)
    xls_photo = serializers.SerializerMethodField('is_photo')

    def is_photo(self, obj):
        try:
            options = {'size': (125, 125), 'crop': True, 'quality': 99}
            photo = get_thumbnailer(obj.photo).get_thumbnail(options).url
            return photo
        except Exception as e:
            return ''

    class Meta:
        model = Export
        fields = ('photo', 'xls_photo', 'title', 'description', 'tags', 'keywords', 'brand_name', 'main_tags')



class ShopSerializer(serializers.ModelSerializer):
    templates = serializers.SerializerMethodField('is_templates')

    class Meta:
        model = Shop
        exclude = ()
        fields = ('id', 'templates', 'name')

    def is_templates(self, obj):
        request = self.context.get('request', None)
        if request:
            templates = Template.objects.filter(shop=obj)
            templates = templates.filter(Q(default=True) | Q(user=request.user)).order_by('sort')
            serializer = TemplateSerializer(templates, many=True)
        else:
            templates = Template.objects.filter(shop=obj, default=True).order_by('sort')
            serializer = TemplateSerializer(templates, many=True)
        return serializer.data
