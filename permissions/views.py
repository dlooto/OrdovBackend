# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import viewsets, status
from .models import ProjectPermission
from .serializers import ProjectPermissionSerializer

from rest_framework import permissions

from django.shortcuts import render

from rest_framework.authentication import SessionAuthentication, BasicAuthentication

from django.http import JsonResponse, HttpResponse

from accounts.models import UserProfile
from django.contrib.auth.models import User

# Create your views here.

# https://stackoverflow.com/questions/30871033/django-rest-framework-remove-csrf
class IsCreationOrIsAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        if request.user.is_authenticated:
            print("user.is_authenticated", request.user.is_authenticated)
        else:
            print("user.is_authenticated", request.user.is_authenticated)

        print("--------------: user", request.user)
        #post_id = self.request.query_params.get('post_id', None)
        #userProfile = UserProfile.objects.get(user=user, user_type=user_type)
        print("userProfile", userProfile)
        """
        print("--------------: user")
        return True

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return

class ProjectPermissionViewSet(viewsets.ModelViewSet):
    queryset = ProjectPermission.objects.all()
    serializer_class = ProjectPermissionSerializer
    permission_classes = (IsCreationOrIsAuthenticated, )
    #authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def get_queryset(self):
        # Refer to: https://www.django-rest-framework.org/api-guide/filtering/#filtering-against-the-url
        qset = ProjectPermission.objects.all()
        post_id = self.request.query_params.get('post_id', None)
        #print("get permission(", post_id, ")")
        if post_id is None or not post_id.isdigit():
            return qset
        qset = qset.filter(post_id=post_id)
        stage_id = self.request.query_params.get('stage', None)
        #print("get permission(", post_id, ") stage(", stage_id, ")")
        if stage_id is not None and stage_id.isdigit():
            qset = qset.filter(stage=stage_id)
        elif stage_id is not None and isinstance(stage_id, list):
            qset = qset.filter(stage__in=stage_id)
        user_id  = self.request.query_params.get('user', None)
        if user_id is not None and user_id.isdigit():
            qset = qset.filter(user_id=user_id)

        return qset
    def create(self, request):
        #print("come here", request.data)
        stageList = request.data.get('stage', None)
        postId = request.data.get('post', None)
        userId = request.data.get('user', None)
        if stageList == None or postId == None or userId == None:
            #print("None", stageList, postId, userId)
            return HttpResponse("Fail")
        # stage is a array, list it
        for stage in stageList:
            permissionInfo = {
                "post": postId,
                "stage": stage,
                "user": userId,
            }
            serializer = ProjectPermissionSerializer(data=permissionInfo)
            if serializer.is_valid(raise_exception=True):
                saved = serializer.save()
                print("saved success: ", saved)
            else:
                print("Fail to save the permission Info")

        return HttpResponse("Success")
