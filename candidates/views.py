# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.urls import reverse
from rest_framework import viewsets

from .forms import UserApplyStep1Form, UserApplyStep2Form

from resumes.models import Resume
from accounts.models import UserProfile

from .models import Candidate
from .serializers import CandidateSerializer

# Create your views here.

def updateResume(request):
    """
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/manager')
    """

    if request.method == 'GET':
        form = UserApplyStep2Form()
    elif request.method == 'POST':
        form = UserApplyStep2Form(request.POST, request.FILES)
        if form.is_valid():
            files = form.files
            data = form.data
            try:
                candidate = request.user.candidate
            except Candidate.DoesNotExist:
                candidate = Candidate.objects.create(user=user)

            resume = Resume(
                candidate = candidate,
                resume_id = 1,
                visible = True,
                gender = data['gender'],
                birth_year = data['birth_year'],
                birth_month = data['birth_month'],
                identity = data['identity'],
                phone_number = data['phone'],
                qq = data['qq'],
                residence = data['residence'],
                email = data['email'],
                #marriaged = data['marriage'],
                degree = data['degree'],
                major = data['major'],
                school = data['school'],
            )
            resume.save()
            messages.add_message(request, messages.SUCCESS,
                'Form submmited successfully.')
            return HttpResponseRedirect(reverse('candidate_apply_success'))
    else:
        messages.add_message(request, messages.ERROR,
            'A valid application key is required to submit doc' + 'Please contact the administrator.')
        form = None
    return render(request, 'candidates/updateResume.html', {'form': form})

def apply_success(request):
    key = request.GET.get('key', None)
    user = UserProfile.verify_token(key)

    if not key or not user:
        messages.add_message(request, messages.ERROR,
            'A valid application key is required to view this page.')
    else:
        return HttpResponseRedirect('/manager')
        jobs_url = reverse('jobs') + '?key=' + key
        availablility_url = reverse('available', args=[user.id]) + '?key=' + key
    return render(request, 'candidate/apply.html',
        {'success':'success', 'jobs_url':jobs_url,'availability_url': availability_url})

class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all().order_by('id')
    serializer_class = CandidateSerializer

    def get_options(self):
        return "options", {
            "resume": [{'label': "alabel", 'value': "avalue"} for obj in Candidate.objects.all()],
        }
    class Meta:
        datatables_extra_json = ('get_options', )
