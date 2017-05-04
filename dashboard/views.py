from django.template import RequestContext
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.models import User
from django.db.models import Count
from operator import itemgetter

from api.models import Word, Template, Export
from rest_framework_tracking.models import APIRequestLog
from djstripe.models import Customer


def statistics(request):
    users = User.objects.extra(select={'day': 'date( date_joined )'}).values('day').annotate(available=Count('date_joined'))
    users = sorted(users, key=itemgetter('day'))

    words = Word.objects.extra(select={'day': 'date( created_date )'}).values('day').annotate(available=Count('created_date'))
    words = sorted(words, key=itemgetter('day'))

    templates = Template.objects.extra(select={'day': 'date( created_date )'}).values('day').annotate(available=Count('created_date'))
    templates = sorted(templates, key=itemgetter('day'))

    calculated = APIRequestLog.objects.filter(path='/v1/dashboard/keywordtool/').extra(select={'day': 'date( requested_at )'}).values('day').annotate(available=Count('requested_at'))
    calculated = sorted(calculated, key=itemgetter('day'))

    export = Export.objects.extra(select={'day': 'date( created_date )'}).values('day').annotate(available=Count('created_date'))
    export = sorted(export, key=itemgetter('day'))

    customers = Customer.objects.extra(select={'day': 'date( created )'}).values('day').annotate(available=Count('created'))
    customers = sorted(customers, key=itemgetter('day'))



    return render(request, 'admin/statistics.html', {
        'users': users,
        'words': words,
        'templates': templates,
        'calculated': calculated,
        'export': export,
        'customers': customers
    })

statistics = staff_member_required(statistics)
