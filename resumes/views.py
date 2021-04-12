# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.shortcuts import render
from django.views import generic

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets, status

# Create your views here.
from .models import Resume
from .filter import query_resumes_by_args
from companies.models import Post, PostTag2
from .models import Education, Tag, Tag2, ResumeTag, ResumePostTag
from tag.models import FocusPoint, ItemInFocusPoint
from experiences.models import Experience, Project, Language, Certification
from .serializers import ResumeSerializer, EducationSerializer, TagSerializer, Tag2Serializer, ResumeTagSerializer
from tag.serializers import FocusPointSerializer, ItemInFocusPointSerializer
from datatableview.views import DatatableView
from datatableview.utils import *
from django.http import JsonResponse, HttpResponse
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt

from rest_framework import permissions

from accounts.models import UserProfile
from django.contrib.auth.models import User
from permissions.models import ProjectPermission

from smart_analyse.views import UpdateCandidatePostMatchInfo

from ordov.choices import (DEGREE_CHOICES, DEGREE_CHOICES_MAP)

import json
import re

class IsCreationOrIsAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        return True
        if request.user.is_authenticated is not True:
            return False
        userProfile = UserProfile.objects.get(user=request.user)
        if userProfile.user_type == "Manager":
            return True;
        if userProfile.user_type != "Recruiter" and userProfile.user_type != "Employer":
            return False;

        # Recruiter and Employer Scenario

        # To get the resumes
        # To Watching the resumes, For a Recruiter, you have limited permissions only by
        # For Recruiter, There should never get the
        # When Updating, you should add the interview
        # How to deliver the priviledge info for one http request
        # How about Put the stage info in http header?
        post = None

        resumeId = request.META.get('HTTP_ORDOV_RESUME_ID', -1)
        postId = request.META.get('HTTP_ORDOV_POST_ID', -1)
        interviewId = request.META.get('HTTP_ORDOV_INTERVIEW_ID', -1)
        statusId = request.META.get('HTTP_ORDOV_STATUS_ID', -1)
        print("resumeId", resumeId, "postId", postId, "interviewId", interviewId)

        try:
            post = Post.objects.get(id=postId)
        except:
            print("Could Not Found The post_id:", postId)
            return False

        permission = ProjectPermission.objects.filter(user=userProfile, post=post, stage=statusId)
        if permission:
            print("has permission------------>")
            return True
        return False

class ResumeView(APIView):
    def get(self, request):
        resumes = Resume.objects.all()

        # resumes, generate more than one single resume, so many=true
        serializer = ResumeSerializer(resumes, many=True)
        return Response ({"resumes": serializer.data})

    def post(self, request):
        resume = request.data.get('resume')
        serializer = ResumeSerializer(data=resume)
        if serializer.is_valid(raise_exception=True):
            resume_saved = serializer.save()

        return Response(
            {"success": "Resume '{}' created successfully".format(resume_saved.username)}
        )


class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all().order_by('id')
    serializer_class = ResumeSerializer
    permission_classes = (IsCreationOrIsAuthenticated, )

    def list(self, request, **kwargs):
        print("xxxxxxxxxxxxxxxxxxxxxx 111111111111111 yyyyyyyyyyyyyyyyyyyy")
        resume = query_resumes_by_args(request.user, **request.query_params)

        post_id = int(request.query_params.get('post_id', 1))

        serializer = ResumeSerializer(
            resume['items'],
            many=True,
            context={'post_id': post_id}
        )
        result = dict()

        result['data'] = serializer.data
        tds = result['data']
        # print(tds)

        # here we can modify the response data, and we can add pesudo fields in
        # serializer, as we handled candidate_id
        for td in tds:
            td.update({'DT_RowId': td['id']})

        result['draw'] = resume['draw']
        result['recordsTotal'] = int(resume['total'])
        result['recordsFiltered'] = int(resume['count'])
        result['data'] = tds
        result['success'] = True
        result['total'] = int(resume['count']) 

        print("data", result)
        return Response(result, status=status.HTTP_200_OK, template_name=None, content_type=None)

class ResumeTable(generic.ListView):
    context_object_name = 't_resume_list'
    template_name = 'resumes/table_resumes.html'

    def get_queryset(self):
        print("________________________")
        return Resume.objects.all()

    def get_context_data(self, **kwargs):
        context = super(ResumeTable, self).get_context_data(**kwargs)
        context['template_table_name'] = 'Resume'

        return context

class Tag2Table(generic.ListView):
    context_object_name = 't_tag_list'
    template_name = 'resumes/table_tags.html'

    """
    item = {
        "resume": 28850,
        "focusPoint": 4,
        "itmeInFocusPoint":3,
        "score": 95,
        "scoreType":1,
    }
    serializer = Tag2Serializer(data=item)
    if serializer.is_valid(raise_exception=True):
        item_saved = serializer.save()
        print("succ to serialize item")
    else:
        print("Fail to serialize item")
    """

    def get_queryset(self):
        print("------HHHHHHHHHHHHHHHHHHHHHHHH------")
        return Tag2.objects.all()

    def get_context_data(self, **kwargs):
        context = super(Tag2Table, self).get_context_data(**kwargs)
        context['template_table_name'] = 'Tag2'

        return context

class MultiTable(generic.ListView):
    context_object_name = 't_resume_list'
    template_name = 'resumes/table_multi.html'

    def get_queryset(self):
        return Resume.objects.all()

    def get_context_data(self, **kwargs):
        context = super(MultiTable, self).get_context_data(**kwargs)
        context['template_table_name'] = 'Resume'
        userProfile = UserProfile.objects.get(user=self.request.user)
        if (userProfile.user_type == "Manager"):
            context['UserType'] = 'Manager'
        return context


class CompositeTable(DatatableView):
    model = Resume

    datatable_options = {
        'structure_template': "datatableview/bootstrap_structure.html",
        'columns' : [
            ('Resume', 'resume_id'),
            ('Name', 'username'),
            ('Gender', 'gender'),
            ('Age', 'age'),
            ('Phone', 'phone_number'),
            ('Email', 'email'),
            ('School', 'school'),
            ('Degree', 'degree'),
            ('Major', 'major'),
            ('Stat', None, 'get_entry_stat')
        ]}

    def get_entry_stat(self, instance, *args, **kwargs):
        return "ABC{}".format(instance.username)

    post_datatable_options = {
        'structure_template': "datatableview/bootstrap_structure.html",
        'columns': [
            'company',
            'department',
            'name',
        ]
    }

    def get_queryset(self, type=None):
        """
        Customized implementation of the queryset getter.  The custom argument ``type`` is managed
        by us, and is used in the context and GET parameters to control which table we return.
        """
        if type is None:
            type = self.request.GET.get('datatable-type', None)

        if type == "C_POST":
            return Post.objects.all()
        return super(CompositeTable, self).get_queryset()

    def get_datatable_options(self, type=None):
        """
        Customized implementation of the options getter.  The custom argument ``type`` is managed
        by us, and is used in the context and GET parameters to control which table we return.
        """
        if type is None:
            type = self.request.GET.get('datatable-type', None)

        options = self.datatable_options

        if type == "C_POST":
            # Return separate options settings
            options = self.post_datatable_options

        return options

    def get_datatable(self, type=None):
        """
        Customized implementation of the structure getter.  The custom argument ``type`` is managed
        by us, and is used in the context and GET parameters to control which table we return.
        """
        if type is None:
            type = self.request.GET.get('datatable-type', None)

        if type is not None:
            datatable_options = self.get_datatable_options(type=type)
            # Put a marker variable in the AJAX GET request so that the table identity is known
            ajax_url = self.request.path + "?datatable-type={type}".format(type=type)

        if type == "C_POST":
            # Change the reference model to Blog, instead of Entry
            datatable = get_datatable_structure(ajax_url, datatable_options, model=Post)
        else:
            return super(CompositeTable, self).get_datatable()

        return datatable


    def get_context_data(self, **kwargs):
        context = super(CompositeTable, self).get_context_data(**kwargs)

        # Get the other structure objects for the initial context
        context['post_datatable'] = self.get_datatable(type="C_POST")

        return context

# In detail View part, there are three part the
class ResumeDetail(generic.DetailView):
    model = Resume
    context_object_name = 't_resume_detail'
    template_name = 'recruit_manager/edit_resume.html'

@ensure_csrf_cookie
def ResumeDetailInfo(request, *args, **kwargs):
    idd = kwargs.get('pk', -1)
    if idd > 0:
        resume = None
        experience = None
        education = None
        project = None
        language = None
        certification = None
        try:
            resume = Resume.objects.get(pk=idd)
            experience = Experience.objects.all().filter(resume_id=idd)
            education = Education.objects.all().filter(resume_id=idd)
            project = Project.objects.all().filter(resume_id=idd)
            language = Language.objects.all().filter(resume_id=idd)
            certification = Certification.objects.all().filter(resume_id=idd)
        except ObjectDoesNotExist:
            print("Error", resume, experience, education)

        path = request.path
        isEdit = False
        if re.match(r'.*resumes/[0-9]*/edit', path):
            isEdit = True
            return render(request, "recruit_manager/edit_resume.html", locals())
        return render(request, "recruit_manager/detail_resume.html", locals())

    else:
        return HttpResponse("bad request")

class EducationView(APIView):
    def get(self, request):
        education = Education.objects.all()
        serializer = EducationSerializer(education, many=True)
        return Response({"educations": serializer.data})
    def post(self, request):
        education = request.data.get('education')
        serializer = EducationSerializer(data=education)
        if serializer.is_valid(raise_exception=True):
            education_saved = serializer.save()
        return Response(
            {"success": "Education '{}' created successfully".format(education_saved.school)}
        )

class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

    def get_queryset(self):
        qset = Education.objects.all()
        resume_id = self.request.query_params.get('resume_id', None)
        if resume_id is not None and resume_id.isdigit():
            qset = qset.filter(resume_id=resume_id)
        return qset

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_queryset(self):
        qset = Tag.objects.all()
        resume_id = self.request.query_params.get('resume_id', None)
        if resume_id is not None and resume_id.isdigit():
            qset = qset.filter(resume_id=resume_id)
        return qset

class ResumeTagViewSet(viewsets.ModelViewSet):
    queryset = ResumeTag.objects.all()
    serializer_class = ResumeTagSerializer

    def list(self, request, **kwargs):
        qset = ResumeTag.objects.all()
        resume_id = self.request.query_params.get('resume_id', None)
        if resume_id is not None and resume_id.isdigit():
            qset = qset.filter(resume_id=resume_id)

        serializer = ResumeTagSerializer(
            qset, many=True, context={})
        result = dict()
        result['data'] = serializer.data
        result['results'] = serializer.data
        print("come tag2 view set ...... 5", serializer.data)
        return Response(result, status=status.HTTP_200_OK, template_name=None, content_type=None)
    def create(self, request):
        print("resumeTag", request.data)
        resumeTagList = request.data
        result = []
        for item in resumeTagList:
            resumeTagItem = item
            operation = resumeTagItem.pop('op')
            postID = resumeTagItem.pop("postID")

            resumeID = resumeTagItem.get("resume", -1)
            rootTagID = resumeTagItem.get("rootTag", -1)
            subTagID = resumeTagItem.get("subTag", -1)

            # check if has beed update for this interview before
            precheckObj, created = ResumePostTag.objects.update_or_create(resume_id=resumeID, post_id=postID, rootTag_id=rootTagID, subTag_id=subTagID)
            if not created and precheckObj.op == operation:
                print("should not update the same item for one interivew", resumeID, postID, rootTagID, subTagID, operation)
                continue
            print("pre (obj, created)", precheckObj)
            precheckObj.op = operation
            precheckObj.save()

            obj, created = ResumeTag.objects.update_or_create(resume_id=resumeID, rootTag_id=rootTagID, subTag_id=subTagID)
            print("(obj, created)", obj, created, resumeID, rootTagID, subTagID)
            if (obj.score == None):
                obj.score = 0
            if operation == 'inc':
                obj.score = obj.score + 1
            elif operation == 'dec':
                obj.score = obj.score - 1
            obj.save()
            result.append(obj)
        UpdateCandidatePostMatchInfo(resumeID)
        serializer = ResumeTagSerializer(result, many=True, context={})
        return Response({'data': serializer.data}, status=status.HTTP_200_OK, template_name=None, content_type=None)

class Tag2ViewSet(viewsets.ModelViewSet):
    queryset = Tag2.objects.all()
    serializer_class = Tag2Serializer

    def create(self, request):
        print("DATA: ", request.data)
        resume_id = request.data.get('resume_id')
        preferList = request.data.get('preferList')
        for item in preferList:
            name = item.get('nameReadable', "NONE")
            prefer = item.get('prefer', "PREFER")
            dislike = item.get('dislike', "DISLIKE")
            if name == "NONE" or prefer == "PREFER":
                continue
            # filter object by foreign tables's name
            print("H: ", name, " ", prefer, " ", item.get('name'))
            f = FocusPoint.objects.filter(models.Q(name=name))
            i = itmeInFocusPoint=ItemInFocusPoint.objects.filter(name=prefer)
            if (len(f) == 0) or (len(i) == 0):
                continue
            try:
                qset = Tag2.objects.get(models.Q(resume_id=resume_id) &
                                    models.Q(focusPoint__name=name) &
                                    models.Q(itmeInFocusPoint__name=prefer))
            except (ObjectDoesNotExist):
                print("To Create the item")
                Tag2.objects.create(
                    resume_id=resume_id,
                    focusPoint=f[0],
                    itmeInFocusPoint=i[0],
                    score=10
                )
                UpdateCandidatePostMatchInfo(resume_id)
                continue
            # add score 10 to current score
            print("To Update the item")
            qset.score = qset.score + 10
            qset.save()

            # update the PostCandidateMatchScore Info
            # TODO: async update the PostCandidate Info
            UpdateCandidatePostMatchInfo(resume_id)
        return Response(
            {"success": ""}
        )
    def list(self, request, **kwargs):
        qset = Tag2.objects.all()
        resume_id = self.request.query_params.get('resume_id', None)
        if resume_id is not None and resume_id.isdigit():
            qset = qset.filter(resume_id=resume_id)

        serializer = Tag2Serializer(
            qset, many=True, context={})
        result = dict()
        result['data'] = serializer.data
        print("come tag2 view set ...... 5", serializer.data)
        return Response(result, status=status.HTTP_200_OK, template_name=None, content_type=None)
@csrf_exempt
def GetDegrees(request):
    jsonData = json.dumps(DEGREE_CHOICES)
    print("DEGREE_CHOICES", jsonData)
    return HttpResponse(jsonData)
