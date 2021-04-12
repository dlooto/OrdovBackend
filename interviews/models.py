# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from candidates.models import Candidate
from companies.models import Post
from resumes.models import Resume
from model_utils import Choices
from tag.models import RootTag, SubTag

# Create your models here.

STATUS_CHOICES = (
    (0, '待筛选'),
    (1, '筛选'),
    (2, '邀约'),
    (3, '面试'),
    (4, 'OFFER'),
    (5, '入职'),
    (6, '考察'),
    (7, '回款'),
    (8, '完成'),
    (-2, '停止'),
    (-1, '自增'),
)

STATUS_ONDUTY_CHOICES = (
    (0, 'Open'),
    (1, '入职确认'),
    (2, '考察期'),
    (3, 'finish'),
)

# 某公司和某个人对应着关系
# 一次面试按理说的话，也是有很多
# 每一次的面试记录也都要留下来
# 面试有许多过程，每个过程分成三种状态, pending, pass, over

class Interview(models.Model):
    class Meta:
        unique_together = (('post', 'resume'), )

    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, null=True)

    is_active = models.BooleanField(default=1)
    status = models.IntegerField(choices=STATUS_CHOICES, default=0)
    # Introduce a callInstanceId to record the callInstance in Baiying
    callInstanceId = models.CharField(max_length=50, blank=True, null=True)
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    result = models.CharField(max_length=50)
    sub_status = models.CharField(max_length=50)

    # manually check
    is_match = models.BooleanField(default=1)

    def __str__(self):
        return '<interview %s:%s:%s' % (self.resume.username, self.post.company.name, self.post.name)

class InterviewLogCommon(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE)
    status = models.IntegerField(choices=STATUS_CHOICES, default=0)
    passInter = models.BooleanField(default=0)
    result = models.TextField(max_length=500, blank=True, null=True, default='')

ORDER_COLUMN_CHOICES = Choices(
    ('0', 'id'),
    ('1', 'resume'),
    ('2', 'resume'),
    ('3', 'post'),
    ('4', 'is_active'),
    ('5', 'status'),
    ('6', 'status'),
)

def query_interviews_by_args(**kwargs):
    draw = int(kwargs.get('draw', [0])[0])
    length = int(kwargs.get('length', [10])[0])
    start = int(kwargs.get('start', [0])[0])
    search_value = kwargs.get('search[value]', [0])[0]
    order_column = kwargs.get('order[0][column]', [0])[0]
    order = kwargs.get('order[0][dir]', [0])[0]

    order_column = ORDER_COLUMN_CHOICES[int(order_column)][1]
    if order == 'desc':
        order_column = '-' + order_column

    queryset = Interview.objects.all()
    total = queryset.count()

    # filter and orderby

    if search_value:
        queryset = queryset.filter(models.Q(post__name__icontains=search_value) |
                                   models.Q(post__department__name__icontains=search_value) |
                                   models.Q(post__department__company__name__icontains=search_value) |
                                   models.Q(resume__username__icontains=search_value))

    # ------
    count = queryset.count()

    queryset = queryset.order_by(order_column)[start:start + length]

    # final decoration

    return {
        'items': queryset,
        'count': count,
        'total': total,
        'draw' : draw,
    }

# ---------------------------------------- Pretty Top Line ----------------------------------------
class InterviewSub_Invite(models.Model):
    pass

class InterviewSub_Invite_Agree(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE)

    date = models.DateField()
    time = models.DateTimeField(auto_now_add=True, auto_now=False)
    contact = models.CharField(max_length=10, blank=True, null=True)
    address = models.CharField(max_length=50, blank=True, null=True)
    certification = models.CharField(max_length=500, blank=True, null=True)
    attention = models.CharField(max_length=500, blank=True, null=True)
    other = models.CharField(max_length=500, blank=True, null=True)

class InterviewSub_Invite_Disagree(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE)

    address = models.CharField(max_length=50, blank=True, null=True)
    industry = models.CharField(max_length=50, blank=True, null=True)
    salary = models.CharField(max_length=50, blank=True, null=True)
    insurance = models.CharField(max_length=50, blank=True, null=True)
    other = models.CharField(max_length=500, blank=True, null=True)

# Interview Appointment SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
class InterviewSub_Appointment(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE)
    result_type = models.IntegerField(null=True)

    date = models.DateTimeField(blank=True, null=True)
    contact = models.CharField(max_length=50, blank=True, null=True)

    address = models.CharField(max_length=50, null=True, blank=True)
    postname = models.CharField(max_length=50, null=True, blank=True)

    certification = models.CharField(max_length=50, null=True, blank=True)
    attention = models.CharField(max_length=50, null=True, blank=True)
    first_impression = models.CharField(max_length=50, null=True, blank=True)

    notes = models.TextField(max_length=500, blank=True, null=True)

# There is no need For Appointment_Agree class
class InterviewSub_Appointment_Agree(models.Model):
    appointment_sub = models.ForeignKey(InterviewSub_Appointment, on_delete=models.CASCADE)

    date = models.DateTimeField(blank=True, null=True)
    contact = models.CharField(max_length=50, blank=True, null=True)

    address = models.CharField(max_length=50, null=True, blank=True)
    postname = models.CharField(max_length=50, null=True, blank=True)

    certification = models.CharField(max_length=50, null=True, blank=True)
    attention = models.CharField(max_length=50, null=True, blank=True)
    first_impression = models.CharField(max_length=50, null=True, blank=True)

    notes = models.TextField(max_length=500, blank=True, null=True)

# Interview Result SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
class InterviewSub_Interview(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE)
    result_type = models.IntegerField(null=True)
    comments = models.CharField(max_length=50, blank=True, null=True)

class InterviewSub_Interview_Pass(models.Model):
    interview_sub = models.ForeignKey(InterviewSub_Interview, on_delete=models.CASCADE)

    comments = models.CharField(max_length=50, blank=True, null=True)

# Interview Offer SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
class InterviewSub_Offer(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, default=0)
    result_type = models.IntegerField(null=True)

    date = models.DateTimeField(blank=True, null=True)

    contact = models.CharField(max_length=50, blank=True, null=True)
    contact_phone = models.CharField(max_length=15, null=True, blank=True)

    address = models.CharField(max_length=50, null=True, blank=True)
    postname = models.CharField(max_length=50, null=True, blank=True)

    certification = models.CharField(max_length=50, null=True, blank=True)
    salary = models.CharField(max_length=50, null=True, blank=True)

    notes = models.TextField(max_length=500, blank=True, null=True)

class InterviewSub_Offer_Agree(models.Model):
    offer_sub = models.ForeignKey(InterviewSub_Offer, on_delete=models.CASCADE, default=0)

    date = models.DateTimeField(blank=True, null=True)

    contact = models.CharField(max_length=50, blank=True, null=True)
    contact_phone = models.CharField(max_length=15, null=True, blank=True)

    address = models.CharField(max_length=50, null=True, blank=True)
    postname = models.CharField(max_length=50, null=True, blank=True)

    certification = models.CharField(max_length=50, null=True, blank=True)
    salary = models.CharField(max_length=50, null=True, blank=True)

    notes = models.TextField(max_length=500, blank=True, null=True)

# Interview Entryed SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
# Entry update info should be updated to Interviewsub_offer_agree?

# Interview Probation SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
class InterviewSub_Probation(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, default=0)
    result_type = models.IntegerField(null=True)

class InterviewSub_Probation_Fail(models.Model):
    #probation_sub = models.ForeignKey(InterviewSub_Probation, on_delete=models.CASCADE, default=0)
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, default=0)
    result_type = models.IntegerField(null=True)

    reason = models.CharField(max_length=50, blank=True, null=True)
    comments = models.CharField(max_length=50, blank=True, null=True)

# Interview Payback SubModal
# ---------------------------------------- Pretty Split Line ----------------------------------------
class InterviewSub_Payback(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, default=0)
    result_type = models.IntegerField(null=True)

class InterviewSub_Payback_Register(models.Model):
    payback_sub = models.ForeignKey(InterviewSub_Payback, on_delete=models.CASCADE, default=0)

    amount = models.IntegerField(null=True)
    pm_amount = models.IntegerField(null=True)
    invitor_amount = models.IntegerField(null=True)
    img = models.CharField(max_length=50, null=True, blank=True)
    notes = models.TextField(max_length=500, blank=True, null=True)

class InterviewSub_Payback_Finish(models.Model):
    payback_sub = models.ForeignKey(InterviewSub_Payback, on_delete=models.CASCADE, default=0)

    notes = models.TextField(max_length=500, blank=True, null=True)

class InterviewSub_Payback_Baddebt(models.Model):
    payback_sub = models.ForeignKey(InterviewSub_Payback, on_delete=models.CASCADE, default=0)

    notes = models.TextField(max_length=500, blank=True, null=True)

class InterviewSub_Payback_Invoice(models.Model):
    payback_sub = models.ForeignKey(InterviewSub_Payback, on_delete=models.CASCADE, default=0)

    companyname = models.CharField(max_length=50, null=True, blank=True)
    idn = models.CharField(max_length=50, null=True, blank=True)
    address = models.CharField(max_length=50, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)

    bank = models.CharField(max_length=50, null=True, blank=True)
    cardid = models.CharField(max_length=50, null=True, blank=True)
    amount = models.IntegerField(null=True)
    mail_address = models.CharField(max_length=50, null=True, blank=True)

    contact = models.CharField(max_length=50, blank=True, null=True)
    contact_phone = models.CharField(max_length=15, null=True, blank=True)

# Interview Terminate SubModal (Currently "active == false" means "terminate == true")
# So, if interview main table show active == false, we can refer this table to find the details.
# ---------------------------------------- Pretty Split Line ----------------------------------------
class InterviewSub_Terminate(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, default=0)

    expected_industry = models.CharField(max_length=50, null=True, blank=True)
    expected_post = models.CharField(max_length=50, null=True, blank=True)
    expected_shift = models.CharField(max_length=50, null=True, blank=True)
    expected_salary = models.CharField(max_length=50, null=True, blank=True)

    expected_notes = models.CharField(max_length=50, null=True, blank=True)

    expected_province = models.CharField(max_length=50, null=True, blank=True)
    expected_city = models.CharField(max_length=50, null=True, blank=True)
    expected_district = models.CharField(max_length=50, null=True, blank=True)

    expected_insurance = models.CharField(max_length=50, null=True, blank=True)
    expected_insurance_schedule = models.CharField(max_length=50, null=True, blank=True)

# ---------------------------------------- Pretty Bottom Line ----------------------------------------
class OnDuty(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    is_active = models.BooleanField(default = 0)
    status = models.IntegerField(choices=STATUS_ONDUTY_CHOICES, default=0)
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    result = models.CharField(max_length=50)

    def __str__(self):
        return '<onduty C: %s B: %s' % (self.candidate.user.username, self.post.name)
