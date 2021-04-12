# -*- coding: utf-8 -*- from __future__ import unicode_literals

from django.shortcuts import render
from django.views import generic

from django.core.files.storage import FileSystemStorage
import time
import json

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets, status

# Create your views here.

from .models import Company, Department, Post, query_posts_by_args, PostTag
from .serializers import CompanySerializer, DepartmentSerializer, PostSerializer, PostTagSerializer

from ordov.choices import (DEGREE_CHOICES, DEGREE_CHOICES_MAP, GENDER_CHOICES)

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

from rest_framework import permissions
from accounts.models import UserProfile
from django.contrib.auth.models import User
from permissions.models import ProjectPermission
from tag.models import FocusPoint, ItemInFocusPoint

from third_party.views import getBaiyingTaskList, importTaskCustomer, get_num_of_instances, get_job_instances2, get_instance_info
import datetime

class CompanyView(APIView):
    def get(self, request):
        companies = Company.objects.all()

        serializer = CompanySerializer(companies, many=True)
        return Response({"companies": serializer.data})

    def post(self, request):
        company = request.data.get('company')

        serializer = CompanySerializer(data=company)
        if serializer.is_valid(raise_exception=True):
            company_saved = serializer.save()

        return Response(
            {"success": "Company '{}' created successfully".format(company_saved.name)}
        )


class DepartmentView(APIView):
    def get(self, request):
        departments = Department.objects.all()

        serializer = DepartmentSerializer(departments, many=True)
        return Response({"departments": serializer.data})

    def post(self, request):
        department = request.data.get('department')

        serializer = DepartmentSerializer(data=department)
        if serializer.is_valid(raise_exception=True):
            department_saved = serializer.save()

        return Response(
            {"success": "Department '{}' created successfully".format(department_saved.name)}
        )


class PostView(APIView):
    def get(self, request):
        posts = Post.objects.all()

        serializer = PostSerializer(posts, many=True)
        return Response({"posts": serializer.data})

    def post(self, request):
        post = request.data.get('post')

        serializer = PostSerializer(data=post)
        if serializer.is_valid(raise_exception=True):
            post_saved = serializer.save()

        return Response(
            {"success": "Post '{}' created successfully".format(post_saved.name)}
        )


class IsCreationOrIsAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        return True
        print("User:", request.user.username, request.user.password)
        if request.user.is_authenticated is not True:
            print("user.is_authenticated", request.user.is_authenticated)
            return False
        userProfile = UserProfile.objects.get(user=request.user)
        if userProfile.user_type == "Manager":
            return True;
        elif userProfile.user_type == "Recruiter" or userProfile.user_type == "Candidate" or userProfile.user_type == "Employer":
            """
            post_id = int(request.query_params.get('post_id', -999))
            if post_id == -999:
                return False
            status_id = int(request.query_params.get('status_id', -999))
            if status_id == -999:
                return False
            """
            # permission = ProjectPermission.objects.get(post=post_id, stage=status_id, user=userProfile)
            permission = ProjectPermission.objects.filter(user=userProfile)
            if (permission):
                return True
            else:
                print("No Found Permission", userProfile)
                return False
        else:
            print("Fail")
            return False
        return False


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('id')
    serializer_class = PostSerializer
    permission_classes = (IsCreationOrIsAuthenticated,)

    def list(self, request, **kwargs):
        post = query_posts_by_args(request.user, **request.query_params)

        # Could only show the user
        # This Post should be

        serializer = PostSerializer(post['items'], many=True)
        result = dict()

        result['data'] = serializer.data
        tds = result['data']

        for td in tds:
            td.update({'DT_RowId': td['id']})

        result['draw'] = post['draw']
        result['recordsTotal'] = int(post['total'])
        result['recordsFiltered'] = int(post['count'])

        return Response(result, status=status.HTTP_200_OK, template_name=None, content_type=None)

    def create(self, request, **kwargs):
        print("request.data", request.data, kwargs)
        postData = request.data
        company_name = postData.pop('company_name')
        company, created = Company.objects.update_or_create(**{'name': company_name})
        print("company created", created)

        department_name = postData.pop('department_name')
        department, created = Department.objects.update_or_create(company=company, **{'name': department_name})
        print("department created", created)

        post, created = Post.objects.update_or_create(company=company, department=department, **postData)
        print("post created", created, post)

        serializer = PostSerializer(post)
        result = dict()
        print("data", serializer.data)

        return Response({"post": serializer.data})


class PostTagViewSet(viewsets.ModelViewSet):
    queryset = PostTag.objects.all().order_by('id')
    serializer_class = PostTagSerializer

    def create(self, request, *args, **kwargs):
        print("Enter create", request.data, args, kwargs)
        posttag, created = PostTag.objects.update_or_create(**request.data)
        print(posttag, created)

        serializer = PostTagSerializer(posttag)
        result = dict()
        print("data", serializer.data)
        return Response({"posttag": serializer.data})

    def list(self, request, **kwargs):
        qset = PostTag.objects.all()
        post_id = self.request.query_params.get('post_id', None)
        if post_id is not None and post_id.isdigit():
            qset = qset.filter(post_id=post_id)
        elif post_id is not None:
            qset = None

        serializer = PostTagSerializer(
            qset, many=True, context={})
        result = dict()
        result['data'] = serializer.data
        result['results'] = serializer.data
        print("come post tag view set ...... ", post_id, serializer.data)
        return Response(result, status=status.HTTP_200_OK, template_name=None, content_type=None)

class PostTable(generic.ListView):
    context_object_name = 't_post_list'
    template_name = 'companies/table_posts.html'

    def get_queryset(self):
        return Post.objects.all()

    def get_context_data(self, **kwargs):
        context = super(PostTable, self).get_context_data(**kwargs)
        context['template_table_name'] = 'Post'
        return context


# TODO: This is a temporary method for update resume from ajax
# and would be removed afterwards
from django.views.decorators.csrf import csrf_exempt


# 备用一个上传文件返回地址的api
def uploadFile(request, fileName):
    uploaded_file_url = ""
    if request.method == 'POST' and not len(request.FILES) is 0 and not len(request.FILES[fileName]) is 0 and request.FILES[fileName]:
        excel_file = request.FILES[fileName]

        now = int(round(time.time() * 1000))
        nowStr = time.strftime('File-%Y-%m-%d-%H-%M-%S-', time.localtime(now / 1000))
        store_name = nowStr + excel_file.name

        fs = FileSystemStorage()
        filename = fs.save(store_name, excel_file)

        # Main logic: Parse the excel
        # PROJECT_DIR = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))

        uploaded_file_url = fs.url(filename)
        # load_excel.load_excel(PROJECT_DIR+uploaded_file_url)

    return uploaded_file_url


@csrf_exempt
def UpdatePost(request):
    if request.method == 'POST':

        # 处理邀约录音和offer录音
        # invite_voice , offer_voice
        SavePost(request.POST)
        return HttpResponse("success")
    return HttpResponse("success")

def SavePost(data):
    #invite_voice = uploadFile(request, "invite_voice")
    #offer_voice = uploadFile(request, "offer_voice")
    invite_voice = ""
    offer_voice = ""

    print("data:::::------->", data)
    keywords = ""
    keywords = data.get('keywords', "")
    print("PUT----------------------------------", keywords)

    company_name = data.get('company_name', '')
    department_name = data.get('department_name', '')
    post_name = data.get('post_name')
    baiying_task = data.get('baiying_task_id', '')
    p_type = data.get('post_type', '')
    talk_hint = data.get('talk_hint', '')
    prologue = data.get('prologue', '')
    workplace = data.get('workplace', '')
    work_purpose = data.get('work_purpose', '')
    wechat_invite = data.get('wechat_invite', '')

    province = data.get('working_place_province', '')
    city = data.get('working_place_city', '')
    district = data.get('working_place_district', '')

    if company_name == "" or department_name == "" or post_name == "" or p_type == "":
        return HttpResponse("fail")
    if province == "" and city == "" and district == "":
        return HttpResponse("fail")

    baiying_fields = baiying_task.split('-')
    if len(baiying_fields) < 2:
        return HttpResponse("fail")
    baiying_task_name = baiying_fields[0]
    baiying_task_id = baiying_fields[1]

    min_degree = data.get('degree_id_min', '')
    max_degree = data.get('degree_id_max', '')
    min_age = data.get('age_id_min', '')
    max_age = data.get('age_id_max', '')
    graduate_start = data.get('graduate_time_start', '')
    graduate_end = data.get('graduate_time_end', '')

    gender = data.get('gender_id')
    salary = data.get('min_salary_id')
    linkman_name = data.get('linkman_name')
    linkman_phone = data.get('linkman_phone')

    project_name = company_name + "-" + province + city + district + "-" + p_type
    ageMin = 0
    if not min_age == "":
        ageMin = int(min_age)
    ageMax = 100
    if not max_age == "":
        ageMax = int(max_age)

    degreeMin = DEGREE_CHOICES_MAP.get(min_degree, 0)
    degreeMax = 100
    if not max_degree.find(u'不限') >= 0:
        degreeMax = DEGREE_CHOICES_MAP.get(max_degree, 100)

    graduate_S = 0
    if not graduate_start == "" and graduate_start.find(u'不限') < 0:
        graduate_S = int(graduate_start)
    graduate_E = 2080
    if not graduate_end == "" and graduate_end.find(u'不限') < 0:
        graduate_E = int(graduate_end)

    salary_offer = data.get('min_salary_id')

    resume_latest_modified = data.get('resume_latest_modified')

    post_info = {
        "department": {
            "description": "",
            "company": {
                "c_type": "",
                "name": company_name,
                "scale": 0,
                "area": "",
                "description": "",
                "short_name": company_name
            },
            "name": department_name
        },
        "description": post_name,
        "name": post_name,
        "address_province": province,
        "address_city": city,
        "address_district": district,
        "salary_offer": salary_offer
    }
    """
    Do Not Use the serializer here
    """
    companyTarget = None
    departTarget = None
    postTarget = None
    company_info = {
        "c_type": "",
        "name": company_name,
        "scale": 0,
        "area": "",
        "description": "",
        "short_name": company_name
    }
    department_info = {
        "description": "",
        "name": department_name
    }
    post_info = {
        "description": post_name,
        "name": post_name,
        "degree": DEGREE_CHOICES_MAP.get(min_degree),
        "degree_min": degreeMin,
        "degree_max": degreeMax,
        "address_province": province,
        "address_city": city,
        "address_district": district,
        "age_min": ageMin,
        "age_max": ageMax,
        "graduatetime_min": graduate_S,
        "graduatetime_max": graduate_E,
        "salary_offer": salary_offer,
        "gender": gender,
        "linkman": linkman_name,
        "linkman_phone": linkman_phone,
        "project_name": project_name,
        "p_type": p_type,
        "baiying_task_name": baiying_task_name,
        "baiying_task_id": int(baiying_task_id),
        "resume_latest_modified": resume_latest_modified,
        "talk_hint": talk_hint,
        "prologue": prologue,
        "workplace": workplace,
        "work_purpose": work_purpose,
        "wechat_invite": wechat_invite,

        "invite_voice": invite_voice,
        "offer_voice": offer_voice,
        "keywords": keywords,

        "level": ""
    }

    companyTarget, created = Company.objects.update_or_create(**company_info)
    departmentTarget, created = Department.objects.update_or_create(company=companyTarget, **department_info)
    postTarget, created = Post.objects.update_or_create(company=companyTarget, department=departmentTarget,
                                                        **post_info)

    # update the key keywords Info to company Info
    print("the company/department/post info has updated")
    print("Now to update the focus point info")

    smartConfig = json.loads(keywords)
    print("smartConfig: ", smartConfig)
    for k, v in smartConfig.items():
        print("value: ", v, " key is: ", k)
        level1Name = v.get('level1Name')
        level2Name = v.get('level2')
        print("level1Name: ", level1Name, " level2Name is: ", level2Name)
        fps  = FocusPoint.objects.filter(name=level1Name)
        ifps = ItemInFocusPoint.objects.filter(name=level2Name)
        print(fps, ifps)
        item = {
            "post": postTarget.id,
            "focusPoint": fps[0].id,
            "itmeInFocusPoint": ifps[0].id,
        }
        serializer = PostTag2Serializer(data=item)
        if serializer.is_valid(raise_exception=True):
            item_saved = serializer.save()
            print("Success to create")
        else:
            print("Fail to create")
            return HttpResponse("Fail to create post info")

    # After the post info created, we should add the
    # the right to the owner, and by the
    return HttpResponse("success")

    """
    serializer = PostSerializer(data=post_info)
    if serializer.is_valid(raise_exception=True):
        post_saved = serializer.save()
    else:
        print("Fail to serialize the post")
    """
    return HttpResponse("fail")

@csrf_exempt
def GetPostConfigTemplate(request):
    taskArray = getBaiyingTaskList()
    print("taskArray", taskArray)
    curYear = datetime.datetime.now().year
    print("curYear", curYear)
    graduateYear = [(i, i) for i in range(curYear-15, curYear+1)]
    graduateYearData = json.dumps(graduateYear)
    print("graduateYear", graduateYearData)
    gender = [{''},{},{}]


    return JsonResponse({
        "AITasks": taskArray,
        "Degrees": DEGREE_CHOICES,
        "GraduateYear": graduateYear,
        "Gender": GENDER_CHOICES,
    })

