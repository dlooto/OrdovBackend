# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views import generic
from django.http import JsonResponse, HttpResponse
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import status as rest_status

from .models import Interview, query_interviews_by_args, STATUS_CHOICES

from .serializers import InterviewSerializer

from .models import InterviewSub_Appointment, InterviewSub_Appointment_Agree
from .serializers import InterviewSub_AppointmentSerializer

from .models import InterviewSub_Interview
from .serializers import InterviewSub_InterviewSerializer

from .models import InterviewSub_Offer, InterviewSub_Offer_Agree
from .serializers import InterviewSub_OfferSerializer

from .models import InterviewSub_Probation_Fail
from .serializers import InterviewSub_Probation_FailSerializer

from .models import InterviewSub_Payback, InterviewSub_Payback_Finish
from .serializers import InterviewSub_PaybackSerializer, InterviewSub_Payback_FinishSerializer

from .models import InterviewSub_Terminate
from .serializers import InterviewSub_TerminateSerializer

from companies.models import Post
from resumes.models import Resume

from rest_framework import status
from third_party.views import getBaiyingTaskList, importTaskCustomer, get_num_of_instances, get_job_instances2, get_instance_info

from resumes.filter import FilterResumeByPostRequest
from django.db import models

import json
import time
import threading

from rest_framework import permissions
from accounts.models import UserProfile
from django.contrib.auth.models import User
from permissions.models import ProjectPermission

class IsCreationOrIsAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        return True
        resumeId = request.META.get('HTTP_ORDOV_RESUME_ID', -1)
        postId = request.META.get('HTTP_ORDOV_POST_ID', -1)
        interviewId = request.META.get('HTTP_ORDOV_INTERVIEW_ID', -1)
        statusId = request.META.get('HTTP_ORDOV_STATUS_ID', -1)
        print("Interview: resumeId", resumeId, "postId", postId, "interviewId", interviewId, "statusId", statusId)

        if request.user.is_authenticated is not True:
            print("user.is_authenticated", request.user.is_authenticated)
            return False
        userProfile = UserProfile.objects.get(user=request.user)
        if userProfile.user_type == "Manager":
            return True;
        elif userProfile.user_type != "Recruiter" and userProfile.user_type != "Candidate" and userProfile.user_type != "Employer":
            print("User Type NOT Recruiter Or Candidate Or Employer")
            return False;

        post = None
        try:
            post = Post.objects.get(id=postId)
        except:
            print("Could Not Found The post_id:", postId)
            return False

        # Recruiter/Candidate/Employer Scenario
        print("Pre Interview: resumeId", resumeId, "postId", postId, "interviewId", interviewId, "statusId", statusId)
        permission = ProjectPermission.objects.filter(post=post, stage=statusId, user=userProfile)
        if permission:
            print("Found Permission-------->")
            return True
        return False

# Create your views here.
class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.all().order_by('id')
    serializer_class = InterviewSerializer
    permission_classes = (IsCreationOrIsAuthenticated, )

    #https://stackoverflow.com/questions/41094013/when-to-use-serializers-create-and-modelviewsets-create-perform-create
    """
    def create(self, request, *args, **kwargs):
        print("Enter create", request.data, args, kwargs)
        serializer = InterviewSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except Exception as e:
            print("Fail to create the instance", e)
        pass
    """
    def update(self, request, pk=None):
        data = request.data
        op = data.pop('op')
        interview = Interview.objects.get(pk=pk)
        if op == 'inc':
            interview.status += 1
        interview.save()
        print(".....H...request", data, pk)
        return HttpResponse("Success")

    def list(self, request, **kwargs):
        interview = query_interviews_by_args(**request.query_params)

        serializer = InterviewSerializer(interview['items'], many=True)
        result = dict()

        result['data'] = serializer.data
        tds = result['data']

        # here we can modify the response data, and we can add pesudo fields in
        # serializer, as we handled candidate_id
        for td in tds:
            resume_obj = Resume.objects.get(pk=td['resume'])
            resume = resume_obj.username + '(ID=' + str(td['resume']) + ')'

            post_obj = Post.objects.get(pk=td['post'])
            post = '-'.join([post_obj.company.name, post_obj.department.name, post_obj.name])

            td.update({'resume_pk': resume_obj.id})
            td.update({'resume': resume})
            td.update({'post': post})
            td.update({'status_name': STATUS_CHOICES[td['status']][1]})

            if resume_obj.candidate:
                td.update({'linked_candidate': resume_obj.candidate.id})
            else:
                td.update({'linked_candidate': None})
            td.update({'DT_RowId': td['resume']})

        result['draw'] = interview['draw']
        result['recordsTotal'] = int(interview['total'])
        result['recordsFiltered'] = int(interview['count'])

        return Response(result, status=rest_status.HTTP_200_OK, template_name=None, content_type=None)

class InterviewTable(generic.ListView):
    context_object_name = 't_interview_list'
    template_name = 'interviews/table_interviews.html'

    def get_queryset(self):
        return Interview.objects.all()

    def get_context_data(self, **kwargs):
        context = super(InterviewTable, self).get_context_data(**kwargs)
        context['template_table_name'] = 'Interview'
        return context

from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def UpdateAIStatus(request):
    if request.method == 'POST':
        print("post------------", request.POST)
        post_id_S = request.POST['post_id']
        subStatus = request.POST['ai_status']
        subStatusAction = request.POST['ai_status_action']
        if post_id_S == '' or subStatus == '' or subStatusAction == '':
            return
        post_id = int(post_id_S)
        if subStatusAction == '通过':
            Interview.objects.filter(post_id=post_id, status=1, sub_status=subStatus).update(status=2, sub_status='邀约')
        elif subStatusAction == '不通过':
            status_string = subStatus + '-终止'
            Interview.objects.filter(post_id=post_id, status=1, sub_status=subStatus).update(status=1, is_active=False, sub_status=status_string)
        return HttpResponse("success")

from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def Task(request):
    if request.method == 'GET':
        task_array = getBaiyingTaskList()
        data = {
           "ai_taskId": task_array
        }
        return JsonResponse(data)
    elif request.method == 'POST':
        print("post------------", request.POST)
        ai_task = request.POST['config_ai_task_name']
        candidate_name = request.POST['ai_candidate_name']
        candidate_phone = request.POST['ai_candidate_phone']
        if ai_task == "" or candidate_name == "" or candidate_phone == "":
            return
        # This is test
        # replace phone with my phone number
        # split the ai_task_id
        postInfo = Post.objects.get(baiying_task_name=ai_task)
        taskid = postInfo.baiying_task_id

        # Do not set phone during daily test, remove this line oneline
        candidate_phone = '00000000000'
        print("to Import", taskid, candidate_name, candidate_phone)
        importTaskCustomer(15960, taskid, candidate_name, candidate_phone) 
        return HttpResponse("success")
    return HttpResponse("fail")

# Interview Appointment SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
class InterviewSub_AppointmentViewSet(viewsets.ModelViewSet):
    queryset = InterviewSub_Appointment.objects.all()
    serializer_class = InterviewSub_AppointmentSerializer
    permission_classes = (IsCreationOrIsAuthenticated, )

# Interview Result SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
class InterviewSub_InterviewViewSet(viewsets.ModelViewSet):
    queryset = InterviewSub_Interview.objects.all()
    serializer_class = InterviewSub_InterviewSerializer
    permission_classes = (IsCreationOrIsAuthenticated, )

# Interview Offer SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
class InterviewSub_OfferViewSet(viewsets.ModelViewSet):
    queryset = InterviewSub_Offer.objects.all()
    serializer_class = InterviewSub_OfferSerializer
    permission_classes = (IsCreationOrIsAuthenticated, )

# Interview Probation SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
class InterviewSub_Probation_FailViewSet(viewsets.ModelViewSet):
    queryset = InterviewSub_Probation_Fail.objects.all()
    serializer_class = InterviewSub_Probation_FailSerializer
    permission_classes = (IsCreationOrIsAuthenticated, )

# Interview Payback SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
class InterviewSub_PaybackViewSet(viewsets.ModelViewSet):
    queryset = InterviewSub_Payback.objects.all()
    serializer_class = InterviewSub_PaybackSerializer
    permission_classes = (IsCreationOrIsAuthenticated, )

class InterviewSub_Payback_FinishViewSet(viewsets.ModelViewSet):
    queryset = InterviewSub_Payback_Finish.objects.all()
    serializer_class = InterviewSub_Payback_FinishSerializer
    permission_classes = (IsCreationOrIsAuthenticated, )

# Interview Terminate SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
class InterviewSub_TerminateViewSet(viewsets.ModelViewSet):
    queryset = InterviewSub_Terminate.objects.all()
    serializer_class = InterviewSub_TerminateSerializer
    permission_classes = (IsCreationOrIsAuthenticated, )

def interviewsub_get_offer_detail(request, interview_id):
    interview_obj = Interview.objects.get(pk=interview_id)
    offers = interview_obj.interviewsub_offer_set.all().order_by('-id')
    #get first, descend, can be multi since updated

    data = {}
    if offers:
        offer_obj = offers[0]
        offer_agrees = offer_obj.interviewsub_offer_agree_set.all()
        #assert(len(offer_agrees) == 1)
        print("len(offer_agrees) == 1 Fault")
        #get first and assert one
        if offer_agrees:
            offer_agree_obj = offer_agrees[0]

            #serialize and pass back as json
            offer_agree_serializer = InterviewSub_Offer_AgreeSerializer(offer_agree_obj)
            data = offer_agree_serializer.data
            data.pop('offer_sub')
            return JsonResponse(data)

    return JsonResponse(data)

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def getAIInfo(request):
    if request.method == "GET":
        print("GET: ", request.GET)
        resume_id = request.GET.get('resume_id', None)
        post_id = request.GET.get('post_id', None)
        if resume_id is None or post_id is None:
            return HttpResponse("fail")
        postInfo = Post.objects.get(id=post_id)
        resumeInfo = Resume.objects.get(id=resume_id)
        callJobId = postInfo.baiying_task_id
        phoneNumber = resumeInfo.phone_number
        print("callJobId: ", callJobId, " phone: ", phoneNumber)
        interviewInfo = None
        instanceId = -1
        if resumeInfo is not None and postInfo is not None:
            try:
                interviewInfo = Interview.objects.get(resume=resumeInfo, post=postInfo)
            except:
                return HttpResponse("fail")
            instanceId = interviewInfo.callInstanceId
        phoneLogs, duration, jobname, tags = get_instance_info(instanceId)
        print("result: ", phoneLogs)
        iMap = {
          "phoneLogs": phoneLogs,
          "phoneDuration": duration,
          "phoneJobName": jobname,
          "phoneTags": tags,
        }
        return JsonResponse(iMap)

@csrf_exempt
def aiTest(request):
    if request.method == "POST":
        returnDataStr = request.body

        print(returnDataStr)
        #returnDataStr = getPesudoResponse()
        returnData = json.loads(returnDataStr)

        sceneInfo = returnData.get('data').get('data').get('sceneInstance')
        if sceneInfo is None:
            return HttpResponse("fail")
        print('\n\n\nsceneInfo', sceneInfo)
        companyId = sceneInfo.get('companyId')
        callJobId = sceneInfo.get('callJobId')
        callInstanceId = sceneInfo.get('callInstanceId')
        candidate = sceneInfo.get('customerName')
        candidate_phone = sceneInfo.get('customerTelephone')
        status = sceneInfo.get('status')
        finishstatus = sceneInfo.get('finishStatus')
        jobName = sceneInfo.get('jobName', "unknown")
        duration = sceneInfo.get('duration', -1)
        tags = ""
        taskResultInfo = returnData.get('data').get('data').get('taskResult')
        if taskResultInfo is not None:
            for result in taskResultInfo:
                resultName = result.get('resultName')
                if resultName.find('客户标签') >= 0:
                    labelList = result.get("resultLabels")
                    for label in labelList:
                        tags = tags + label.get("value") + ";"
        print("Found valid tags", tags)

        postInfo = None
        resumeInfo = None
        try:
            postInfo = Post.objects.get(baiying_task_id=callJobId)
            resumeInfo = Resume.objects.get(phone_number=candidate_phone)
        except:
            return HttpResponse("fail")

        if postInfo is None or resumeInfo is None:
            print("Not imported into db now")
            return HttpResponse("fail")

        interviewInfo = Interview.objects.get(resume=resumeInfo, post=postInfo)
        if interviewInfo is None:
            print("No such item in interview")
            return HttpResponse("fail")
        if interviewInfo.status != 1:
            print("Steal Info interview")
            return HttpResponse("fail")

        print("companyId:", companyId, " callJobId:", callJobId, " candiate: ", candidate, "phone: ", candidate_phone, "callInsence", callInstanceId)
        interviewInfo.callInstanceId = callInstanceId

        print("Update the callInstanceInfo:", callInstanceId, duration, tags, jobName)
        resumeInfo.callInstanceId =  callInstanceId
        resumeInfo.callPhoneDuration = str(duration) + "s"
        resumeInfo.callTags = tags
        resumeInfo.callJobName = jobName
        resumeInfo.save()

        if status == 2 and finishstatus == 2:
            #未接通case
            interviewInfo.sub_status = '未接通AI'
            interviewInfo.save()
            return HttpResponse("fail")
        if status == 2 and finishstatus == 1:
            interviewInfo.sub_status = '拒绝'
            interviewInfo.save()
            return HttpResponse("fail")
        if status == 2 and finishstatus == 3:
            interviewInfo.sub_status = '主叫号码不可用'
            interviewInfo.save()
            return HttpResponse("fail")
        if status == 2 and finishstatus == 4:
            interviewInfo.sub_status = '空号'
            interviewInfo.save()
            return HttpResponse("fail")
        if status == 2 and finishstatus == 5:
            interviewInfo.sub_status = '关机'
            interviewInfo.save()
            return HttpResponse("fail")
        if status == 2 and finishstatus == 6:
            interviewInfo.sub_status = '占线'
            interviewInfo.save()
            return HttpResponse("fail")
        if status == 2 and finishstatus == 7:
            interviewInfo.sub_status = '停机'
            interviewInfo.save()
            return HttpResponse("fail")
        if status == 2 and finishstatus == 8:
            interviewInfo.sub_status = '未接'
            interviewInfo.save()
            return HttpResponse("fail")
        if status == 2 and finishstatus == 9:
            interviewInfo.sub_status = '主叫欠费'
            interviewInfo.save()
            return HttpResponse("fail")
        if status == 2 and finishstatus == 10:
            interviewInfo.sub_status = '呼损'
            interviewInfo.save()
            return HttpResponse("fail")
        if status == 2 and finishstatus == 11:
            interviewInfo.sub_status = '黑名单'
            interviewInfo.save()
            return HttpResponse("fail")
        elif status == 2 and finishstatus == 0:
            #已经接通
            taskResultInfo = returnData.get('data').get('data').get('taskResult')
            if taskResultInfo is None:
                return HttpResponse("fail")
            for result in taskResultInfo:
                resultName = result.get('resultName')
                resultValue = result.get('resultValue')
                if resultName.find('客户意向等级') >= 0:
                    interviewInfo.sub_status = resultValue
                    interviewInfo.save()
                    break
        else:
            interviewInfo.sub_status = '未知状态'
            interviewInfo.save()
            return HttpResponse("fail")

    if request.method == "GET":
        print("Get")
    return HttpResponse("success")

def UpdateInstanceInfoForProject(projId):
    pass

def UpdateInstanceInfoBackgroud():
    while True:
        # 找出所有的项目
        posts = Post.objects.all();
        for postInfo in posts:
            print("To Update: ", postInfo.project_name)
            by_task_id = postInfo.baiying_task_id
            total = get_num_of_instances(by_task_id)
            """
            if total == postInfo.baiying_talk_done:
                print("No Need to Update: ", postInfo.project_name, total, postInfo.baiying_talk_done)
                continue
            """
            pages = int(total/50) + 1
            print("Number of Pages: ", pages, "total", total)
            for i in range(1, pages+1, 1):
                pInfo = get_job_instances2(by_task_id, i, 50)
                iList = None
                #print("pInfo: ", pInfo)
                try:
                    iList = pInfo["data"]["list"]
                except:
                    print("Fail to get", iList)
                    continue
                for item in iList:
                    instanceId = item.get("callInstanceId", -1)
                    phone = item.get("customerTelephone", "123456789")
                    if instanceId != -1 and phone != "123456789": 
                        # Update the instance Info
                        # Update the post info and interview info
                        resumeInfo = None
                        interviewInfo = None
                        try:
                            resumeInfo = Resume.objects.get(phone_number=phone)
                            interviewInfo = Interview.objects.get(resume=resumeInfo, post=postInfo)
                        except Exception as e:
                            print(e)
                            print("Fail to get Info", instanceId, phone, resumeInfo, interviewInfo)
                            continue
                        interviewInfo.callInstanceId = instanceId;
                        interviewInfo.save();
                        print("Success to get Info", instanceId, phone, resumeInfo.username)

            #instance = get_job_instances(by_task_id)
            # Update the talk_done info
            postInfo.baiying_talk_done = total;
            postInfo.save();
        time.sleep(60)

#thread1 = threading.Thread(target=UpdateInstanceInfoBackgroud)
#thread1.start()
@csrf_exempt
def GetInterviewMetaInfo(request):
    interviewStatus = []
    postID = int(request.GET.get('post_id', -1))
    if postID < 0:
        return JsonResponse({'data':interviewStatus})
    for curStage in iter(STATUS_CHOICES):
        curStageId = curStage[0]
        count = 0
        if curStage[0] < 0:
            continue
        if curStage[0] == 0:
            queryset_waitting = Resume.objects.exclude(interview__post__id=postID)
            queryset_waitting = FilterResumeByPostRequest(queryset_waitting, postID)
            queryset_waitting = queryset_waitting.filter(~models.Q(hunting_status=0))
            count = queryset_waitting.count()
        else:
            count = Resume.objects.filter(interview__status=curStageId, interview__post__id=postID,
                    interview__is_active=True).count()
        interviewStatus.append((curStage[0], curStage[1], count))
    print("__________", interviewStatus)
    return JsonResponse({
        'data': interviewStatus})
