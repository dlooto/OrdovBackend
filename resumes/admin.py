# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Resume

"""
class ResumeAdmin(admin.ModelAdmin):
    list_display=('username', 'gender','identity', 'phone_number','email','degree','major')
"""
# Register your models here.
admin.site.register(Resume)

