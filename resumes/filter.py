# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views import generic

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets, status

# Create your views here.
from .models import Resume
from companies.models import Post
from .models import Education
from experiences.models import Experience, Project, Language, Certification
from .serializers import ResumeSerializer, EducationSerializer
from datatableview.views import DatatableView
from datatableview.utils import *
from django.http import JsonResponse, HttpResponse
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import permissions

from accounts.models import UserProfile
from django.contrib.auth.models import User
from permissions.models import ProjectPermission

from .choices import (BIRTH_YEAR_CHOICES, MAJOR_CHOICES, MARRIAGE_CHOICES, EDUCATION_TYPE_CHOICES)
from ordov.choices import (DEGREE_CHOICES, DEGREE_CHOICES_MAP, HUNTING_STATUS_CHOICES, HUNTING_STATUS_CHOICES_MAP)

from model_utils import Choices

ORDER_COLUMN_CHOICES = Choices(
    ('0', 'id'),  # CK
    ('1', 'interview_id'),  # IID
    ('2', 'candidate_id'),  # CID
    ('3', 'id'),  # ID
    ('4', 'username'),  # *Name
    ('5', 'gender'),  # Gender
    ('6', 'age'),  # Age
    ('7', 'phone_number'),  # Phone
    ('8', 'email'),  # email
    ('9', 'school'),  # school
    ('10', 'degree'),  # degree
    ('11', 'major'),  # *Major
    ('12', 'is_match'),  # ismatch
    ('13', 'status'),  # status
    ('14', 'id'),  # action
)

# temporary use location as expected
def expect_helper(queryset, expected_field, level):
    prefix = 'current_settle_'
    params1 = {
        prefix + level + '__exact': '',
    }
    params2 = {
        prefix + level + '__isnull': True,
    }
    params3 = {
        prefix + level + '__icontains': expected_field,
    }

    if expected_field and expected_field != "":
        queryset = queryset.filter(models.Q(**params1) |
                                   models.Q(**params2) |
                                   models.Q(**params3))
    return queryset

def FilterResumeByPostRequest(queryset, post_id):
    post_request = None
    try:
        post_request = Post.objects.get(id=post_id)
    except (ObjectDoesNotExist, MultipleObjectsReturned):
        print("EXCEPT: ObjectDoesNotExist, MultipleObjectsReturned")

    if post_request:
        post_age_min = post_request.age_min or 0
        post_age_max = post_request.age_max or 100
        post_degree_min = post_request.degree_min or 0
        post_degree_max = post_request.degree_max or 100
        post_gender = post_request.gender or ""
        post_province = post_request.address_province
        post_city = post_request.address_city
        post_district = post_request.address_district
        post_resume_latest_modified = post_request.resume_latest_modified

        queryset = queryset.filter(models.Q(degree__gte=post_degree_min) &
                                   models.Q(degree__lte=post_degree_max) &
                                   models.Q(age__gte=post_age_min) &
                                   models.Q(age__lte=post_age_max))
        if post_gender.find(u'男') >= 0:
            queryset = queryset.filter(models.Q(gender__contains='m'))
        elif post_gender.find(u'女') >= 0:
            queryset = queryset.filter(models.Q(gender__contains='f'))

        # post_province/city/district filter

        #queryset = expect_helper(queryset, post_province, 'province')
        #queryset = expect_helper(queryset, post_city, 'city')
        #queryset = expect_helper(queryset, post_district, 'district')

        """
        if post_resume_latest_modified is not None:
            queryset = queryset.filter(models.Q(last_modified__gte=post_resume_latest_modified))
        """

    return queryset

def FilterResumeByCustomizedRequest(queryset, **kwargs):
    # The Following valus are filter under '岗位要求设置'
    # which is temporary
    search_value = kwargs.get('search[value]', [0])[0]

    age_min = kwargs.get('age_id_min', [''])[0] or 0
    age_max = kwargs.get('age_id_max', [''])[0] or 1000

    degree_min = kwargs.get('degree_id_min', [''])[0]
    degree_max = kwargs.get('degree_id_max', [''])[0]

    graduate_time_min = kwargs.get('graduate_time_min', [''])[0]
    graduate_time_max = kwargs.get('graduate_time_max', [''])[0]

    expected_province = kwargs.get('province', [''])[0]
    expected_city = kwargs.get('city', [''])[0]
    expected_district = kwargs.get('district', [''])[0]

    gender_f = kwargs.get('gender_id', [''])[0]

    # filter and orderby
    if not gender_f.find(u'不限') >= 0:
        if gender_f.find(u'男') >= 0:
            queryset = queryset.filter(models.Q(gender__contains='m'))
        elif gender_f.find(u'女') >= 0:
            queryset = queryset.filter(models.Q(gender__contains='f'))

    degree_id_min = DEGREE_CHOICES_MAP.get(degree_min, 0)
    degree_id_max = 100

    age_id_min = 0
    if not age_min == '':
        age_id_min = int(age_min)
    age_id_max = 0
    if not age_max == '':
        age_id_max = int(age_max)

    if not degree_max.find(u'不限') >= 0:
        degree_id_max = DEGREE_CHOICES_MAP.get(degree_max, 100)

    queryset = queryset.filter(models.Q(degree__gte=degree_id_min) &
                               models.Q(degree__lte=degree_id_max) &
                               models.Q(age__gte=age_id_min) &
                               models.Q(age__lte=age_id_max))

    # graducate_time filter
    graduate_time_min_int = 0
    graduate_time_max_int = 100000
    if not graduate_time_min == "" and graduate_time_min.find(u'不限') < 0:
        graduate_time_min_int = int(graduate_time_min)
        queryset = queryset.filter(models.Q(graduate_year__gte=graduate_time_min_int))
    if not graduate_time_max == "" and graduate_time_max.find(u'不限') < 0:
        graduate_time_max_int = int(graduate_time_max)
        queryset = queryset.filter(models.Q(graduate_year__gte=graduate_time_max_int))

    # expected_province/city/district filter
    queryset = expect_helper(queryset, expected_province, 'province')
    queryset = expect_helper(queryset, expected_city, 'city')
    queryset = expect_helper(queryset, expected_district, 'district')

    # search_value box
    if search_value:
        # split the fields by blank
        # max 4 field to check
        fields = search_value.split()
        for i in range(0, min(len(fields), 4)):
            field = fields[i]
            queryset = queryset.filter(models.Q(username__icontains=field) |
                                       models.Q(phone_number__icontains=field) |
                                       models.Q(email__icontains=field) |
                                       models.Q(school__icontains=field) |
                                       models.Q(major__icontains=field) |
                                       models.Q(experience__post_name__icontains=field) |
                                       models.Q(experience__company_name__icontains=field))
        queryset = queryset.distinct()

    return queryset


# query_resume_by_args is call By the user-defined filter Info
def query_resumes_by_args(user, **kwargs):
    draw = int(kwargs.get('draw', [0])[0])
    length = int(kwargs.get('length', [10])[0])
    start = int(kwargs.get('start', [0])[0])
    order_column = kwargs.get('order[0][column]', [0])[0]
    order = kwargs.get('order[0][dir]', [0])[0]
    current = int(kwargs.get('current', [0])[0])
    pageSize = int(kwargs.get('pageSize', [0])[0])
    print("--------------", current, pageSize)
    print("--------------", start, length)
    if (kwargs.get('useAntdProtable', [0])[0]): 
        print("Fix up the info for antd protable", (kwargs.get('useAntdProtable', [0])[0]))
        if current < 1:
            current = 1
        start = (current-1) * pageSize
        length = pageSize
        print("after fixup:(start, lenght)", start, length)

    order_column = ORDER_COLUMN_CHOICES[int(order_column)][1]
    if order == 'desc':
        order_column = '-' + order_column

    status_id = int(kwargs.get('status_id', [0])[0])
    post_id = int(kwargs.get('post_id', [0])[0])

    if status_id == 0:
        queryset = Resume.objects.exclude(interview__post__id=post_id)

    elif status_id > 0:
        queryset = Resume.objects.filter(interview__status=status_id, interview__post__id=post_id,
                                         interview__is_active=True)
    elif status_id < 0:
        queryset = Resume.objects.filter(interview__status__gte=0, interview__post__id=post_id,
                                         interview__is_active=False)
    else:
        queryset = Resume.objects.all()

    # step1: Filter from post request
    print("status_id", status_id, "post_id", post_id)
    queryset = FilterResumeByPostRequest(queryset, post_id)

    # step1.1: Skip ones who would not find a job
    queryset = queryset.filter(~models.Q(hunting_status=1))

    total = queryset.count()

    # step2: Filter from user-defined filter
    queryset = FilterResumeByCustomizedRequest(queryset, **kwargs)

    count = queryset.count()

    # filter by
    # ==================================>
    # queryset = queryset.filter(candidatepostmatchscore__post__id=post_id).order_by('score')[start:start+length]
    # mock the left join logic
    querysetSmart = queryset.filter(candidatepostmatchscore__post__id=post_id).order_by('-candidatepostmatchscore__score', order_column)
    print("..querySetSmart", len(querysetSmart))
    querysetOriginal = queryset.order_by(order_column)[start:start + length]
    print("..querySetOriginal", len(querysetOriginal))
    lenQuerysetSmart = len(querysetSmart)
    # the max is start + length
    if lenQuerysetSmart >= start + length:
        queryset = querysetSmart[start:start + length]
    elif lenQuerysetSmart <= start or lenQuerysetSmart == 0:
        queryset = querysetOriginal
    else:
        print("Lengh: ", start, " ", lenQuerysetSmart)
        queryset = querysetSmart[start:lenQuerysetSmart]
        print("Queryset: ", queryset)
        for i in range(0, length *2):
            if i >= len(querysetOriginal):
                break
            itemOriginal = querysetOriginal[i]
            hasAdded = False
            for itemAdded in queryset:
                if itemOriginal.id == itemAdded.id:
                    hasAdded = True
                    break
            if not hasAdded:
                queryset.append(itemOriginal)
            if len(queryset) == length:
                break
    # ===================================>



    # order by score
    # queryset = queryset.order_by(order_column)[start:start + length]

    # smart recruiter

    # final decoration
    for q in queryset:
        q.degree = DEGREE_CHOICES[q.degree][1]
        q.gender = "Female" if (q.gender == 'f') else "Male"

    return {
        'items': queryset,
        'count': count,
        'total': total,
        'draw': draw,
    }
