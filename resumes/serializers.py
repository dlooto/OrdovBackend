from rest_framework import serializers

from candidates.serializers import CandidateSerializer
from .models import Resume, Education, Tag, Tag2, ResumeTag
from tag.models import FocusPoint, ItemInFocusPoint
from interviews.models import Interview, STATUS_CHOICES
from smart_analyse.models import CandidatePostMatchScore

from ordov.choices import (DEGREE_CHOICES, DEGREE_CHOICES_MAP)
from third_party.views import getBaiyingTaskList, importTaskCustomer, get_num_of_instances, get_job_instances2, get_instance_info
from experiences.models import Experience, Project, Language, Certification

import json

class ResumeSerializer(serializers.ModelSerializer):
    candidate = CandidateSerializer(required=False)
    candidate_id = serializers.SerializerMethodField()
    interview_id = serializers.SerializerMethodField()
    interview_status = serializers.SerializerMethodField()
    interview_status_name = serializers.SerializerMethodField()
    workexp = serializers.SerializerMethodField()
    ageg = serializers.SerializerMethodField()
    majorfull = serializers.SerializerMethodField()
    newname = serializers.SerializerMethodField()
    birthorigin = serializers.SerializerMethodField()
    expected = serializers.SerializerMethodField()
    current_settle = serializers.SerializerMethodField()
    lastmod = serializers.SerializerMethodField()
    workexp2 = serializers.SerializerMethodField()
    matchscore = serializers.SerializerMethodField()

    def get_candidate_id(self, resume):
        if resume.candidate:
            return resume.candidate.id
        else:
            return None

    def get_id(self, resume):
        return resume.id

    def get_ageg(self, resume):
        resume_id = resume.id
        post_id = self.context.get('post_id')

        matchScore = CandidatePostMatchScore.objects.filter(
                resume_id=resume_id,
                post_id=post_id,
                )
        score = 0
        if len(matchScore) > 0:
            score = matchScore[0].score
        return "年龄:" + str(resume.age)+" " "毕业: "+str(resume.graduate_time) + " " "匹配度" + str(score)

    def get_matchscore(self, resume):
        resume_id = resume.id
        post_id = self.context.get('post_id')

        matchScore = CandidatePostMatchScore.objects.filter(
                resume_id=resume_id,
                post_id=post_id,
                )
        score = 0
        if len(matchScore) > 0:
            score = matchScore[0].score
        return "匹配度 " + str(score)

    def get_majorfull(self, resume):
        degree_str = ""
        if type(resume.degree) == type(1):
            degree_str = DEGREE_CHOICES[resume.degree][1]
        elif type(resume.degree) == type("str"):
            degree_str = resume.degree
        major_str = resume.major
        return resume.school + ">" + degree_str + ">" + major_str

    def get_newname(self, resume):
        if resume.gender == "Male":
            return resume.username
        elif resume.gender == "Female":
            return resume.username+"(女)"
        else:
            return resume.username

    def get_lastmod(self, resume):
        return (str(resume.last_modified.strftime("%Y/%m/%d")))

    def get_expected(self, resume):
        #TODO: expected city and more
        expect = ""
        if resume.expected_province is not None:
            expect = expect + resume.expected_province
        if resume.expected_city is not None:
            expect = expect + resume.expected_city
        if resume.expected_district is not None:
            expect = expect + resume.expected_district
        if resume.expected_street is not None:
            expect = expect + resume.expected_street
        return expect

    def get_current_settle(self, resume):
        current_settle = ""
        if resume.current_settle_province is not None:
            current_settle += resume.current_settle_province
        if resume.current_settle_city is not None:
            current_settle += resume.current_settle_city
        if resume.current_settle_district is not None:
            current_settle += resume.current_settle_district
        if resume.current_settle_street is not None:
            current_settle += resume.current_settle_street

        return current_settle

    def get_birthorigin(self, resume):
        birth =""
        hasBirthInfo = False
        if resume.birth_province is not None:
            birth = birth + resume.birth_province
            hasBirthInfo = True
        if resume.birth_city is not None:
            birth = birth + "." + resume.birth_city
            hasBirthInfo = True
        if resume.birth_district is not None:
            birth = birth + "." + resume.birth_district
            hasBirthInfo = True
        if resume.birth_street is not None:
            birth = birth + "." + resume.birth_street
            hasBirthInfo = True
        if hasBirthInfo is False:
            return "无籍贯信息"
        return birth

    # by post id, can be is_in_interview for post1 but not for post2
    def get_workexp(self, resume):
        resume = Resume.objects.get(pk=resume.id)
        exps = resume.experience_set.all()

        if exps:
            expression = '</br>'.join([str(exp) for exp in exps])
            return expression
        else:
            return "--"

    def get_workexp2(self, resume):
        resume = Resume.objects.get(pk=resume.id)
        exps = resume.experience_set.all()
        experiences = Experience.objects.all().filter(resume_id=resume.id)
        print("____exps_____", experiences)
        keywords = []
        for item in experiences:
            print("____exps_____222____", item)
            keywords.append(item.company_name)
            keywords.append(item.post_name)
        data = json.dumps(keywords)
        return data

    def get_interview_id(self, resume):
        post_id = self.context.get('post_id')

        objs = Interview.objects.filter(post__pk=post_id, resume__pk=resume.id)
        if (objs):
            return objs[0].id
        else:
            return None

    def get_interview_status(self, resume):
        post_id = self.context.get('post_id')


        objs = Interview.objects.filter(post__pk=post_id, resume__pk=resume.id)
        if (objs):
            assert len(objs) == 1
            return objs[0].status
        else:
            # default 0
            return 0

    def get_interview_status_name(self, resume):
        post_id = self.context.get('post_id')

        # status_name such a complicated issue
        statusId = -1
        objsStatusId = Interview.objects.filter(post__pk=post_id, resume__pk=resume.id)
        if (objsStatusId):
            statusId = int(objsStatusId[0].status)

        objs = Interview.objects.filter(post__pk=post_id, resume__pk=resume.id)
        if (objs):
            assert len(objs) == 1
            # check the status
            if statusId == 3:
                appointmentObjs = objs[0].interviewsub_appointment_set.all()
                #assert len(appointmentObjs) == 1
                if len(appointmentObjs) < 1:
                    return "--"
                #assert len(agreeObjs) == 1
                if appointmentObjs[0].date is not None:
                    return "约定面试: "+appointmentObjs[0].date.strftime("%Y/%m/%d %H:%M:%S")
                else:
                    agreeObjs = appointmentObjs[0].interviewsub_appointment_agree_set.all()
                    if len(agreeObjs) > 0:
                        return "约定面试: "+agreeObjs[0].date.strftime("%Y/%m/%d %H:%M:%S")
                    else:
                        return "无该同学面试时间信息"
                # the interview status, we should show the interview time
            elif statusId == 4:
                offerObjs = objs[0].interviewsub_offer_set.all()
                if len(offerObjs) < 1:
                    return "请填写offer信息"
                offerAgreeObjs = offerObjs[0].interviewsub_offer_agree_set.all()
                if len(offerAgreeObjs) < 1:
                    return "请填写offer信息"
                if offerAgreeObjs[0].date is None:
                    return "请填写offer入职时间信息"
                else:
                    return "预期入职: " + offerAgreeObjs[0].date.strftime("%Y/%m/%d %H:%M:%S")
            elif statusId == 5:
                offerObjs = objs[0].interviewsub_offer_set.all()
                if len(offerObjs) < 1:
                    return "无该同学offer信息"
                offerAgreeObjs = offerObjs[0].interviewsub_offer_agree_set.all()
                if len(offerAgreeObjs) < 1:
                    return "无该同学offer信息"
                if offerAgreeObjs[0].date is None:
                    return "无该同学入职时间信息"
                else:
                    return "预期入职: " + offerAgreeObjs[0].date.strftime("%Y/%m/%d %H:%M:%S")
            else:
                return objs[0].sub_status
        else:
            # default 0
            # which means there are no items yet, show the ai
            resumeObjs = Resume.objects.filter(pk=resume.id)
            interviewObjs = Interview.objects.filter(resume__pk=resume.id)
            if resumeObjs and interviewObjs and len(resumeObjs)==1: # a valid resume
                if resumeObjs[0].callInstanceId is not None:
                    duration = resumeObjs[0].callPhoneDuration
                    jobname = resumeObjs[0].callJobname
                    tags = resumeObjs[0].callTags
                    #return jobname + "/" + duration + "/" + tags + "\n\r"
                    if jobname is None:
                        jobname = "unknownJob"
                    if tags is None:
                        tags = "notags"
                    if duration is None:
                        duration = "-1s"
                    return "AI历史: " + jobname + "/" + duration + "/" + tags + "\n\r"
                    # No instance Info in resume info
                for interview in interviewObjs:
                    if interview.callInstanceId is not None:
                        print("Found a valid instance info")
                        return "Never"
                        phoneLog, duration, jobname, tags = get_instance_info(interview.callInstanceId)
                        # save the info to resume info
                        resumeObjs[0].callInstanceId = interview.callInstanceId
                        resumeObjs[0].callPhoneDuration = duration
                        resumeObjs[0].callTags = tags
                        resumeObjs[0].callJobname = jobname

                        resumeObjs[0].save()
                        return "AI历史: " + jobname + "/" + duration + "/" + tags + "\n\r"
                        #return "AI项目名(" + jobname + ")\n\r" + "时长(" + duration + ")\n\r" + "标签(" + tags + ")\n\r"
                        # No interview info
                return "Never call AI before"

            return "Never call AI before B"

    class Meta:
        model = Resume
        fields = (
            # MethodField

            'interview_id',
            'candidate_id',
            'id',
            'interview_status',
            'interview_status_name',
            'workexp',
            'workexp2',
            'ageg',
            'newname',
            'birthorigin',
            'expected',
            'current_settle',
            'majorfull',
            'lastmod',

            # CascadeField
            'candidate',

            # OrdinaryField

            'resume_id',
            'visible',
            'username',
            'gender',
            'birth_year',
            'birth_month',
            'date_of_birth',
            'identity',
            'age',
            'hunting_status',

            'phone_number',
            'qq',
            'residence',
            'email',
            'marriage',

            'degree',
            'major',
            'school',

            'birth_province',
            'birth_city',
            'birth_district',
            'birth_street',

            'current_settle_province',
            'current_settle_city',
            'current_settle_district',
            'current_settle_street',

            'expected_province',
            'expected_city',
            'expected_district',
            'expected_street',

            'current_settle_province',
            'current_settle_city',
            'current_settle_district',
            'current_settle_street',

            'expected_industry',
            'expected_salary',
            'expected_post',
            'expected_restmodel',
            'expected_insurance_place_type',
            'expected_insurance_time_type',

            'graduate_time',
            'graduate_year',

            'last_modified',
            'matchscore',

        )

    def create(self, validated_data):
#        try:
#            candidate_data = validated_data.pop('candidate')
#            candidate = CandidateSerializer.create(CandidateSerializer(), validated_data=candidate_data)

#            resume, created = Resume.objects.update_or_create(
#                candidate=candidate, **validated_data)
#            return resume
#        except KeyError:

#            resume = Resume.objects.create(**validated_data)
#            return resume

        # create resume, currently we use the phone as key to identify one resume
        resumeTarget = None
        try:
            phone=validated_data['phone_number']
            if phone == '':
                return None
            resumeTarget = Resume.objects.get(phone_number=phone)
        except:
            pass
        if resumeTarget is None:
            candidate_data = validated_data.pop('candidate')
            resume = Resume.objects.create(**validated_data)
            return resume
        else:
            return resumeTarget

class EducationSerializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: ExperienceSerializer
    class Meta:
        model = Education
        fields = (
            'id',
            'resume', # foreginkey
            'start',
            'end',
            'school',
            'college',
            'major',
            'degree',
            'edu_type',
            'province',
            'city',
            'district',
            'street',
            'place',
            'instructor',
            'instructor_phone',
        )

class TagSerializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: EducationSerializer
    class Meta:
        model = Tag
        fields = (
            'id',
            'resume', # foreginkey
            'tag',
            'last_modified',
            'created',
        )


class Tag2Serializer(serializers.ModelSerializer):

    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    # REFER TO: EducationSerializer
    candidateName = serializers.SerializerMethodField()
    focusPointName = serializers.SerializerMethodField()
    itemInFocusPointName = serializers.SerializerMethodField()

    def get_candidateName(self, tag2):
        cand = Resume.objects.filter(pk=tag2.resume.id)
        if (cand):
            assert len(cand) == 1
            return cand[0].username
        else:
            return "MockUserName"
    def get_focusPointName(self, tag2):
        fps = FocusPoint.objects.filter(pk=tag2.focusPoint.id)
        if (fps):
            assert len(fps) == 1
            return fps[0].name
        else:
            return "MockFocus"
    def get_itemInFocusPointName(self, tag2):
        ifps = ItemInFocusPoint.objects.filter(pk=tag2.itmeInFocusPoint.id)
        if (ifps):
            assert len(ifps) == 1
            return ifps[0].name
        else:
            return "MockItem"
    class Meta:
        model = Tag2
        fields = (
            'id',
            'resume',
            'focusPoint', # foreginkey
            'itmeInFocusPoint', #foregnKey
            'score',
            'scoreType',
            'last_modified',
            'created',
            'candidateName',
            'focusPointName',
            'itemInFocusPointName',
        )

class ResumeTagSerializer(serializers.ModelSerializer):
    rootTag_name = serializers.CharField(source='rootTag.name')
    subTag_name = serializers.CharField(source='subTag.name')
    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    class Meta:
        model = ResumeTag
        fields = (
            'id',
            'resume',
            'rootTag', # foreginkey
            'subTag', #foregnKey
            'score',
            'scoreType',
            'last_modified',
            'created',
            'rootTag_name',
            'subTag_name',
         )

