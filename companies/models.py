# -*- encoding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from model_utils import Choices
from .choices import SCALE_CHOICES
from ordov.choices import DEGREE_CHOICES

from django.contrib.auth.models import Permission
from accounts.models import UserProfile
from tag.models import FocusPoint, ItemInFocusPoint, RootTag, SubTag


# Create your models here.

class Area(models.Model):
    name = models.CharField(max_length=50, primary_key=True)
    description = models.TextField(blank=True, null=True, default='')

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)


class Company(models.Model):
    name = models.CharField(max_length=50, primary_key=True)
    short_name = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(max_length=1000, blank=True, null=True, default='')
    scale = models.IntegerField(default=0, blank=True, null=True)
    scale2 = models.TextField(blank=True, null=True, choices=SCALE_CHOICES)

    registerd_capital = models.IntegerField(default=0, blank=True, null=True)
    founding_time = models.DateField(blank=True, null=True)
    # unified social credit code
    uscc = models.CharField(max_length=50, blank=True, null=True)

    # TODO: Here's a replicated fields to Post's fields, will be removed
    # Otherwise, we should make this more smart, company will gether the Post's address info if empty
    # And Post can inherent Company's address by default, so let's just make it the same as Post's for the first step
    address_province = models.CharField(max_length=10, blank=True, null=True)
    address_city = models.CharField(max_length=10, blank=True, null=True)
    address_district = models.CharField(max_length=10, blank=True, null=True)
    address_street = models.CharField(max_length=20, blank=True, null=True)
    address_suite = models.CharField(max_length=20, blank=True, null=True)

    phone_number = models.CharField(max_length=15, null=True, blank=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    website = models.CharField(max_length=50, blank=True, null=True)

    # image and radio
    business_licence = models.ImageField(blank=True, null=True);
    # introduce_radio = models.

    # choice
    area_ptr = models.ForeignKey(Area, on_delete=models.CASCADE, blank=True, null=True)
    area = models.CharField(max_length=50, blank=True, null=True)
    c_type = models.CharField(max_length=50, blank=True, null=True)

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return self.name


class Department(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=1000, blank=True, null=True)

    # reserved
    reserved1 = models.CharField(max_length=50, blank=True, null=True, default='')
    reserved2 = models.CharField(max_length=50, blank=True, null=True, default='')

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return self.name


class Post(models.Model):
    # TODO: to confirm it is safe to hierarchy CASCADE here
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    project_name = models.CharField(max_length=50, blank=True, null=True)

    p_type = models.CharField(max_length=50, blank=True, null=True, default='')
    p_feature = models.CharField(max_length=50, blank=True, null=True, default='')
    p_xingzhi = models.CharField(max_length=50, blank=True, null=True, default='')
    description = models.CharField(max_length=1000, blank=True, null=True, default='')
    # the level field should be in experience table
    level = models.CharField(max_length=20, blank=True, null=True, default='')
    subsidy = models.CharField(max_length=20, blank=True, null=True, default='')
    sum_salary = models.CharField(max_length=20, blank=True, null=True, default='')
    year_yard = models.CharField(max_length=20, blank=True, null=True, default='')
    social_security = models.CharField(max_length=20, blank=True, null=True, default='')
    other_benefit = models.CharField(max_length=20, blank=True, null=True, default='')

    address_province = models.CharField(max_length=10, blank=True, null=True, default='')
    address_city = models.CharField(max_length=10, blank=True, null=True, default='')
    address_district = models.CharField(max_length=10, blank=True, null=True, default='')
    address_street = models.CharField(max_length=20, blank=True, null=True, default='')
    # company address can have this 'Suite' address, this is distinguished from candidates' address
    # Like 'Building 2A Suite 402'
    address_suite = models.CharField(max_length=20, blank=True, null=True, default='')

    # Requirement for the post
    degree = models.IntegerField(blank=True, null=True, choices=DEGREE_CHOICES)
    degree_min = models.IntegerField(blank=True, null=True, choices=DEGREE_CHOICES)
    degree_max = models.IntegerField(blank=True, null=True, choices=DEGREE_CHOICES)
    graduatetime_min = models.IntegerField(blank=True, null=True)
    graduatetime_max = models.IntegerField(blank=True, null=True)
    age_min = models.IntegerField(blank=True, null=True)
    age_max = models.IntegerField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    recruit_count = models.IntegerField(blank=True, null=True)
    salary_offer = models.CharField(max_length=20, blank=True, null=True, default='')
    observe_time = models.IntegerField(blank=True, null=True)
    interview_location = models.CharField(max_length=30, blank=True, null=True)
    linkman = models.CharField(max_length=10, blank=True, null=True, default='')
    linkman_phone = models.CharField(max_length=15, null=True, blank=True, default='')

    # talk hint
    talk_hint = models.CharField(max_length=1000, null=True, blank=True)
    # 开场白
    prologue = models.CharField(max_length=1000, null=True, blank=True)
    # 沟通工作地点
    workplace = models.CharField(max_length=1000, null=True, blank=True)
    # 沟通工作意愿
    work_purpose = models.CharField(max_length=1000, null=True, blank=True)
    # 微信邀请
    wechat_invite = models.CharField(max_length=1000, null=True, blank=True)
    # 邀约录音
    invite_voice = models.CharField(max_length=1000, null=True, blank=True)
    # offer录音
    offer_voice = models.CharField(max_length=1000, null=True, blank=True)
    # 关键词json
    keywords = models.CharField(max_length=1000, null=True, blank=True)

    # reserved
    reserved1 = models.CharField(max_length=50, blank=True, null=True, default='')
    reserved2 = models.CharField(max_length=50, blank=True, null=True, default='')

    # baiying ai
    baiying_task_name = models.CharField(max_length=50, blank=True, null=True, default='')
    baiying_task_id = models.IntegerField(blank=True, null=True)
    baiying_talk_done = models.IntegerField(blank=True, null=True)

    # time related
    resume_latest_modified = models.DateTimeField(null=True, blank=True)

    # table related info
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def save(self, *args, **kwargs):
        if not self.project_name:
            self.project_name = Company.objects.get(pk=self.company).name + '-' + self.name
        super(Post, self).save(*args, **kwargs)

    def __str__(self):
        return "%s,%s,%s" % (self.name, self.department.name, self.company.name)

    class Meta:
        unique_together = (
            ('company', 'department', 'name'),
        )


ORDER_COLUMN_CHOICES = Choices(
    ('0', 'id'),
    ('1', 'department'),
    ('2', 'name'),
    ('3', 'project_name'),
    ('4', 'description'),
)


def query_posts_by_args(user, **kwargs):
    draw = int(kwargs.get('draw', [0])[0])
    length = int(kwargs.get('length', [15])[0])
    start = int(kwargs.get('start', [0])[0])
    search_value = kwargs.get('search[value]', [0])[0]
    order_column = kwargs.get('order[0][column]', [0])[0]
    order = kwargs.get('order[0][dir]', [0])[0]

    order_column = ORDER_COLUMN_CHOICES[int(order_column)][1]
    if order == 'desc':
        order_column = '-' + order_column

    queryset = Post.objects.all()
    total = queryset.count()

    # get user Info
    # user should be the
    # return items which
    """
    userProfile = UserProfile.objects.get(user=user)
    if userProfile.user_type != "Manager":
        queryset = queryset.filter(models.Q(projectpermission__user=userProfile)).distinct()
    """

    # filter and orderby
    if search_value:
        queryset = queryset.filter(models.Q(department__company__name__icontains=search_value) |
                                   models.Q(department__name__icontains=search_value) |
                                   models.Q(name__icontains=search_value) |
                                   models.Q(description__icontains=search_value))

    # ------
    count = queryset.count()


    queryset = queryset.order_by('-created')[start:start + length]
    # final decoration

    return {
        'items': queryset,
        'count': count,
        'total': total,
        'draw': draw,
    }

class PostTag2(models.Model):
    post	     = models.ForeignKey(Post, on_delete=models.CASCADE, default='')
    focusPoint       = models.ForeignKey(FocusPoint, on_delete=models.CASCADE, default='')
    itmeInFocusPoint = models.ForeignKey(ItemInFocusPoint, on_delete=models.CASCADE, default='')
    score            = models.IntegerField(null=True)
    scoreType        = models.IntegerField(null=True)

    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

class PostTag(models.Model):
    post	     = models.ForeignKey(Post, on_delete=models.CASCADE, default='')
    rootTag          = models.ForeignKey(RootTag, on_delete=models.CASCADE, default='')
    subTag           = models.ForeignKey(SubTag, on_delete=models.CASCADE, default='')
    score            = models.IntegerField(null=True)
    scoreType        = models.IntegerField(null=True)

    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    class Meta:
        unique_together = (
            ('post', 'rootTag', 'subTag'),
        )
