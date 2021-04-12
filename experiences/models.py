# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from resumes.models import Resume
from companies.models import Company, Department, Post
# Create your models here.

#
# TODO: 工作经历表关联company表
# 与 Employee 表是一对多的关系，即一个应聘者包含多个
# 让员工去填公司全称简直是噩梦
class Experience(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, default='')
    start = models.DateField(blank=True, null=True)
    end = models.DateField(blank=True, null=True)

    # company info, currently we record the company info in charField
    # TODO: generate the foreign to company/department/post
    company_name = models.CharField(max_length=50, blank=True, null=True)
    department_name = models.CharField(max_length=50, blank=True, null=True)
    post_name = models.CharField(max_length=50, blank=True, null=True)

    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, blank=True, null=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, blank=True, null=True)

    # TODO: merge province/city/
    work_province = models.CharField(max_length=20, blank=True, null=True)
    work_city = models.CharField(max_length=30, blank=True, null=True)
    work_district = models.CharField(max_length=30, blank=True, null=True)

    # post info
    level = models.CharField(max_length=50, blank=True, null=True)
    description = models.CharField(max_length=50, blank=True, null=True)
    salary = models.IntegerField(default=0)
    deduct_salary = models.IntegerField(default=0)
    leave_reason = models.CharField(max_length=20, blank=True, null=True)
    shift = models.CharField(max_length=20, blank=True, null=True)
    duty = models.TextField(max_length=500, blank=True, null=True, default='')
    subornates = models.IntegerField(default=0)
    # the following three fields should be in post field
    # TODO: move these fields to Post
    p_type = models.CharField(max_length=50, blank=True, null=True, default='')
    p_feature = models.CharField(max_length=50, blank=True, null=True, default='')

    witness = models.CharField(max_length=20, blank=True, null=True)
    witness_post = models.CharField(max_length=20, blank=True, null=True)
    witness_phone = models.CharField(max_length=15, null=True, blank=True)

    # reserved fields
    reserved1 = models.CharField(max_length=50, blank=True, null=True)
    reserved2 = models.CharField(max_length=50, blank=True, null=True)

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return '{}: {} {}'.format(self.start, self.company_name, self.post_name)

    class Meta:
        permissions = (
            ("edit_experience", "Can edit the experience"),
            ("delete2_experience", "Can delete the experience"),
        )

class Project(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, default='')
    start = models.DateField(blank=True, null=True)
    end = models.DateField(blank=True, null=True)

    name = models.CharField(max_length=20, blank=True, null=True)
    brief = models.TextField(max_length=500, blank=True, null=True, default='')
    scale = models.IntegerField(default=0)
    role = models.CharField(max_length=20, blank=True, null=True)

    company_name = models.CharField(max_length=50, blank=True, null=True, default='')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=True, null=True)

    duty = models.CharField(max_length=50, blank=True, null=True)
    summary = models.TextField(max_length=500, blank=True, null=True, default='')

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

class Language(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, default='')
    name = models.CharField(max_length=10, blank=True, null=True, default='')
    cert = models.CharField(max_length=20, blank=True, null=True, default='')
    description = models.TextField(max_length=100, blank=True, null=True, default='')

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

class Certification(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, default='')
    time = models.CharField(max_length=20, blank=True, null=True, default='')
    name = models.CharField(max_length=20, blank=True, null=True, default='')
    institution = models.CharField(max_length=50, blank=True, null=True, default='')
    description = models.TextField(max_length=100, blank=True, null=True, default='')

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
