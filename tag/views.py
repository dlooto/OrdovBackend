from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import FocusPoint, ItemInFocusPoint, RootTag, SubTag
from .serializers import FocusPointSerializer, ItemInFocusPointSerializer, RootTagSerializer, SubTagSerializer
from rest_framework import permissions
from django.db import models
from django.http import HttpResponse

# Create your views here.

# Removed
class FocusPointViewSet(viewsets.ModelViewSet):
    queryset = FocusPoint.objects.all()
    serializer_class = FocusPointSerializer

# does the root tag would be created and updated automatically?
class RootTagViewSet(viewsets.ModelViewSet):
    queryset = RootTag.objects.all()
    serializer_class = RootTagSerializer

class ItemInFocusPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return True

tagMap = {
        'areaType': '行业类别',
        'postType': '岗位类别',
        'postLevelType': '岗位级别',
        'postLobbyType': '岗位作息',
        'socialSecurity': '社保公积金',
        'postFeature': '岗位特征',
}

class SubTagViewSet(viewsets.ModelViewSet):
    queryset = SubTag.objects.all()
    serializer_class = SubTagSerializer

    def list(self, request):
        qSet = SubTag.objects.all()
        rootTagID = request.query_params.get('rootTag', -1)
        if int(rootTagID) > 0:
            qSet = qSet.filter(models.Q(rootTag_id=rootTagID))
        serializer = SubTagSerializer(qSet, many=True)
        return Response ({"results": serializer.data, 'data': serializer.data})

class ItemInFocusPointViewSet(viewsets.ModelViewSet):
    queryset = ItemInFocusPoint.objects.all()
    serializer_class = ItemInFocusPointSerializer
    permission_classes = (ItemInFocusPermission, )
    def create(self, request):
        kind = request.data.get('kind')
        name = request.data.get('name')
        print("Create Request", kind, name)

        kindName = tagMap.get(kind, "BAD")
        if kindName == "BAD":
            return HttpResponse("bad kind name" + kind)

        fps = FocusPoint.objects.filter(name=kindName)
        if (fps):
            assert len(fps) == 1
        else:
            # create it if not exist
            item = {
                "name": kindName,
            }
            serializer = FocusPointSerializer(data=item)
            if serializer.is_valid(raise_exception=True):
                item_saved = serializer.save()
                print("success to create", kind, kindName)
            else:
                print("fail to create", kind)
                return HttpResponse("fail to create" + kind + kindName)

        if not (fps):
            fps = FocusPoint.objects.filter(name=kindName)

        idd = fps[0].id
        qSet = ItemInFocusPoint.objects.all()
        qSet = qSet.filter(models.Q(focusPoint_id=idd))
        qSet = qSet.filter(models.Q(name=name))
        if (qSet):
            return HttpResponse("("+kind+","+name+") has exist")

        item = {
            "focusPoint": idd,
            "name": name,
        }

        serializer = ItemInFocusPointSerializer(data=item)
        if serializer.is_valid(raise_exception=True):
            item_saved = serializer.save()
            print("success to create", kind, name)
        else:
            print("fail to create", kind, name)
            return HttpResponse("fail to create ("+kind+","+name+")")
        return HttpResponse("success")

    def update(self, request, pk=None):
        print("Update Request")
        pass

    def list(self, request):
        print("List Request", request.data)
        qSet = ItemInFocusPoint.objects.all()
        focus = request.query_params.get('focus')
        if focus:
            kindName = tagMap.get(focus, "BAD")
            if kindName == "BAD":
                return HttpResponse("bad kind name" + focus)
            fps = FocusPoint.objects.filter(name=kindName)
            if (fps):
                assert len(fps) == 1
            else:
                # create it if not exist
                return HttpResponse("no kind bad kind name" + focus)

            idd = fps[0].id
            qSet = qSet.filter(models.Q(focusPoint_id=idd))

        serializer = ItemInFocusPointSerializer(qSet, many=True)
        return Response ({"results": serializer.data, 'data': serializer.data})
