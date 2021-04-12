# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Company, Department, Post

class CompanyAdmin(admin.ModelAdmin):
    list_display=('name','short_name','scale','area', 'c_type', 'description')

class DepartmentAdmin(admin.ModelAdmin):
    list_display=('name','description')

class PostAdmin(admin.ModelAdmin):
    list_display=('name','description')
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'department1':
            kwargs["queryset"] = Department.objects.filter(name=r'中国国际金融股份有限公司')
        return super(PostAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)
    """
    def render_change_form(self, request, context, *args, **kwargs):
        context['adminform'].form.fields['department'].queryset = Department.objects.filter()
        return super(PostAdmin, self).render_change_form(request, context, *args, **kwargs)
    """

# Register your models here.
admin.site.register(Company, CompanyAdmin)
admin.site.register(Department, DepartmentAdmin)
admin.site.register(Post, PostAdmin)
