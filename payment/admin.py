from django.contrib import admin

from .models import Vip

class VipAdmin(admin.ModelAdmin):
    list_display = ['id', 'user']
    date_hierarchy = 'created_date'

admin.site.register(Vip, VipAdmin)
