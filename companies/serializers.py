from rest_framework import serializers

from .models import Area, Company, Department, Post, PostTag
from ordov.choices import DEGREE_CHOICES
from tag.models import FocusPoint, ItemInFocusPoint

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = (
            'name',
            'description',
            )
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = (
            'name',
            'short_name',
            'description',
            'scale',

            'area',
            'c_type',
            )

class DepartmentSerializer(serializers.ModelSerializer):

    company = CompanySerializer(required=True)

    class Meta:
        model = Department
        fields = (
            'company', # foreignkey
            'name',
            'description',
        )

    def create(self, validated_data):
        company_data = validated_data.pop('company')

        company = CompanySerializer.create(CompanySerializer(), validated_data=company_data)

        department, created = Department.objects.update_or_create(
            company=company,
            **validated_data)

        return department

class PostSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(required=True)
    id = serializers.SerializerMethodField()
    name2 = serializers.SerializerMethodField()
    place = serializers.SerializerMethodField()
    link = serializers.SerializerMethodField()
    request = serializers.SerializerMethodField()
    tag = serializers.SerializerMethodField()

    def get_id(self, post):
        return post.id
    def get_name2(self, post):
        return post.company.name + '.' + post.department.name
    def get_place(self, post):
        try:
            return post.address_province + post.address_city + post.address_district
        except TypeError:
            return "未填写"
    def get_tag(self, post):
        """
        postTags = PostTag2.objects.values("post", "focusPoint__name", "itmeInFocusPoint__name").filter(post_id=post.id)
        print("postTags: ", postTags, "id: ", post.id)
        smartInfo = ""
        for item in postTags:
            smartInfo += item.get('focusPoint__name') + '/' + item.get('itmeInFocusPoint__name') + ';'
            print("k:", item)
        return "Tag: " +  smartInfo
        """
        return "____"

    def get_link(self, post):
        try:
            if post.linkman == "" and post.linkman_phone == "":
                return "未填写"
            return post.linkman + "(" + post.linkman_phone + ")"
        except TypeError:
            return "未填写"

    def get_request(self, post):
        degree_min = 0
        degree_max = post.degree_max
        if not degree_max:
            degree_max = 0
        if degree_max > 9:
            degree_max = 9
        if degree_min < 1:
            degree_min = 1

        return "年龄[" + str(post.age_min) + "," + str(post.age_max) + "] " + \
            "学历[" + DEGREE_CHOICES[degree_min][1] + "," + DEGREE_CHOICES[degree_max][1]+"] " + \
            "毕业时间[" + str(post.graduatetime_min) + "," + str(post.graduatetime_max) + "]"

    class Meta:
        model = Post
        fields = (
            'id',
            'department',

            'name',
            'name2',
            'project_name',
            'description',
            'baiying_task_name',

            'place',
            'link',
            'request',

            'talk_hint',
            'prologue',
            'workplace',
            'work_purpose',
            'wechat_invite',

            'address_province',
            'address_city',
            'address_district',
            'address_street',
            'address_suite',
            'tag',
            'linkman',
            'linkman_phone',
            'created',
        )

    def create(self, validated_data):
        department_data = validated_data.pop('department')

        department_ = DepartmentSerializer.create(DepartmentSerializer(), validated_data=department_data)
        company_ = department_.company

        post, created = Post.objects.update_or_create(
            company=company_,
            department=department_,
            **validated_data)

        return post

class PostTagSerializer(serializers.ModelSerializer):
    rootTag_name = serializers.CharField(source='rootTag.name')
    subTag_name = serializers.CharField(source='subTag.name')
    # DO NOT WRAP EMBEDDED FOREIGN KEY OBJECT HERE
    class Meta:
        model = PostTag
        fields = (
            'id',
            'post',
            'rootTag', # foreginkey
            'subTag', #foregnKey
            'score',
            'scoreType',
            'last_modified',
            'created',
            'rootTag_name',
            'subTag_name',
        )
