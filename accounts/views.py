# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib import messages
from .forms import SignUpForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from accounts.models import UserProfile
from allauth.account.views import LoginView
from rest_framework import status as rest_status
from rest_framework.response import Response
from django.contrib.auth.models import Permission

import requests

from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from rest_framework import viewsets, status
from .serializers import UserProfileSerializer

# Create your views here.

def get_user_info(result):
    """
    获取用户信息
    """
    get_user_url = "https://api.weibo.com/2/users/show.json"
    uid = result["uid"]
    access_token = result["access_token"]
    user_info = requests.get(url=get_user_url, params={"access_token": access_token, "uid": uid})
    return user_info

def process(request):
    code = request.GET.get("code")
    print("--->code", code)
    result = get_token(code)  # 获取access_token和用户uid
    result = result.json()
    print("result: ", result)
    userinfo = get_user_info(result).json()
    print("user_info", userinfo)

	# A Typical UserInfo Returned From Weibo
    # user_info {'id': 7032578234, 'idstr': '7032578234', 'class': 1, 'screen_name': 'bigjson90',
	# 'name': 'bigjson90', 'province': '11', 'city': '1000', 'location': '������', 'description': '',
	# 'url': '', 'profile_image_url': 'https://tvax1.sinaimg.cn/default/images/default_avatar_female_50.gif?KID=imgbed,tva&Expires=1568458610&ssig=B2Bh8y5PL2',
	# 'profile_url': 'u/7032578234', 'domain': '', 'weihao': '', 'gender': 'f', 'followers_count': 2,
	# 'friends_count': 60, 'pagefriends_count': 0, 'statuses_count': 1, 'video_status_count': 0,
	# 'favourites_count': 0, 'created_at': 'Thu Mar 14 22:46:39 +0800 2019', 'following': False,
	# 'allow_all_act_msg': False, 'geo_enabled': True, 'verified': False, 'verified_type': -1,
	# 'remark': '', 'insecurity': {'sexual_content': False},
	# 'status': {'created_at': 'Thu Mar 14 22:48:11 +0800 2019', 'id': 4349876726770469, 'idstr': '4349876726770469', 'mid': '4349876726770469', 'can_edit': False, 'show_additional_indication': 0, 'text': 'hello', 'textLength': 5, 'source_allowclick': 0, 'source_type': 1, 'source': '<a href="http://app.weibo.com/t/feed/6vtZb0" rel="nofollow">������ weibo.com</a>', 'favorited': False, 'truncated': False, 'in_reply_to_status_id': '', 'in_reply_to_user_id': '', 'in_reply_to_screen_name': '', 'pic_urls': [], 'geo': None, 'is_paid': False, 'mblog_vip_type': 0, 'reposts_count': 0, 'comments_count': 0, 'attitudes_count': 0, 'pending_approval_count': 0, 'isLongText': False, 'reward_exhibition_type': 0, 'hide_flag': 0, 'mlevel': 0, 'visible': {'type': 0, 'list_id': 0}, 'biz_feature': 0, 'hasActionTypeCard': 0, 'darwin_tags': [], 'hot_weibo_tags': [], 'text_tag_tips': [], 'mblogtype': 0, 'rid': '0', 'userType': 0, 'more_info_type': 0, 'positive_recom_flag': 0, 'content_auth': 0, 'gif_ids': '', 'is_show_bulletin': 2, 'comment_manage_info': {'comment_permission_type': -1, 'approval_comment_type': 0},'pic_num': 0},
	# 'ptype': 0, 'allow_all_comment': True,
	# 'avatar_large': 'https://tvax1.sinaimg.cn/default/images/default_avatar_female_180.gif?KID=imgbed,tva&Expires=1568458610&ssig=icWnjl121I',
	# 'avatar_hd': 'https://tvax1.sinaimg.cn/default/images/default_avatar_female_180.gif?KID=imgbed,tva&Expires=1568458610&ssig=icWnjl121I', 'verified_reason': '',
	# 'verified_trade': '', 'verified_reason_url': '', 'verified_source': '', 'verified_source_url': '',
	# 'follow_me': False, 'like': False, 'like_me': False, 'online_status': 0, 'bi_followers_count': 0,
	# 'lang': 'zh-cn', 'star': 0, 'mbtype': 0, 'mbrank': 0, 'block_word': 0, 'block_app': 0, 'credit_score': 80,
	# 'user_ability': 0, 'urank': 0, 'story_read_state': -1, 'vclub_member': 0, 'is_teenager': 0, 'is_guardian': 0, 'is_teenager_list': 0}

    return HttpResponseRedirect("/manager")

def signin(request):
    print("signin------------->")
    if request.method == 'POST':
        #step2: register the userprofile
        data = request.POST
        print("data", data)
        username = data.get('username')
        password = data.get('password')
        user_type = data.get('user_type')
        print("username:", username, " password:", password, " user_type:", user_type)
        user = authenticate(username=username, password=password)
        if not user:
            print("No such user...")
            return render(request, 'accounts/signin.html')
        else:
            print("Login success")

        userProfile = None
        try:
            userProfile = UserProfile.objects.get(user=user, user_type=user_type)
        except (ObjectDoesNotExist, MultipleObjectsReturned):
            print("Not Exist")
            return render(request, 'accounts/signin.html')
        #step3: login and redirect
        login(request, user)
        print("-------------------------signin successful")
        n = request.GET.get('next', None)
        print("-------------------------request.GET: ", request.GET, request.POST)
        print("-------------------------request: ", request)
        print("-------------------------signin n: ", n)
        if n is not None:
            return HttpResponseRedirect(n, request)
        else:
            return HttpResponseRedirect("/", request)

    return render(request, 'accounts/signin.html')

def signup(request):
    """
    username_raw = "xiaoming"
    password_raw = "123456"
    user = authenticate(username=username_raw, password=password_raw)
    if user is None:
        # The only way to create user info is the User.objects.create_user(**)
        user = User.objects.create_user(username=username_raw,password=password_raw)
        userprofile = UserProfile(
            user = user,
            user_type = "Candidate",
        )
        userprofile.save()
    user = authenticate(username=username_raw, password=password_raw)
    permission = Permission.objects.get(codename="add_experience")
    user.user_permissions.add(permission)
    if user.has_perm("experiences.add_experience"):
        print("has permission")

    print("login:", user)
    #login(request, user)
    return HttpResponseRedirect("/manager")
    """
    # --------------------------------

    print("--------------------------------------------")
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            #step1: store to table user_auth
            #form.save()

            #step2: register the userprofile
            data = form.data
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user_type = form.cleaned_data.get('user_type')
            user = authenticate(username=username, password=raw_password)
            if not user:# means the user not exist
                print("Create User ", username, raw_password, user_type)
                user = User.objects.create_user(username=username, password=raw_password)
                userprofile = UserProfile(
                    user = user,
                    user_type = user_type,
                )
                userprofile.save()
                user = authenticate(username=username, password=raw_password)

            #step3: login and redirect
            login(request, user)
            return HttpResponseRedirect("/manager")
        else:
            # https://docs.djangoproject.com/en/2.2/ref/forms/api/
            print("form is invalid ..", form.errors)
    return render(request, 'accounts/signup.html')

def get_token(code):
    """
    获取access_token
    http://open.weibo.com/wiki/Oauth2/access_token
    """
    app_key = "2616154578"
    app_secret = "79a238815da135a5a0912514f7ebd93d"
    token_url = "https://api.weibo.com/oauth2/access_token"
    params = {
        "client_id": app_key,
        "client_secret": app_secret,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://127.0.0.1:8000/process"
    }
    result = requests.post(url=token_url, data=params)
    print("login result --> ", result)
    return result

class MyLoginView(LoginView):
    template_name = 'accounts/signin.html'

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        # Refer to: https://www.django-rest-framework.org/api-guide/filtering/#filtering-against-the-url
        qset = UserProfile.objects.all()
        user_type = self.request.query_params.get('user_type', None)
        if user_type is not None and user_type is not "":
            qset = qset.filter(user_type=user_type)
        return qset

