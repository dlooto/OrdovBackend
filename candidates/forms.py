from django import forms
from django_countries.fields import LazyTypedChoiceField
from django_countries import countries
from ordov.choices import (BIRTH_YEAR_CHOICES, BIRTH_MONTH_CHOICES,EDUCATION_CHOICES, MARRIAGE_CHOICES,MAJOR_CHOICES,
	 GENDER_CHOICES)

class UserApplyStep1Form(forms.Form):
    username = forms.CharField(max_length=20)
    phone = forms.CharField(max_length=12)

class UserApplyStep2Form(forms.Form):
    birth_year = forms.TypedChoiceField(choices=BIRTH_YEAR_CHOICES)
    birth_month = forms.TypedChoiceField(choices=BIRTH_MONTH_CHOICES)
    gender = forms.TypedChoiceField(choices=GENDER_CHOICES)
    identity = forms.CharField(max_length=20, label='身份证')
    qq = forms.CharField(max_length=20, label='QQ')
    email = forms.EmailField(max_length=50)
    residence = forms.CharField(max_length=50, label='详细地址')
    marriage = forms.TypedChoiceField(choices=MARRIAGE_CHOICES)
    degree = forms.TypedChoiceField(choices=EDUCATION_CHOICES, label='最高学位')
    phone = forms.CharField(max_length=20)
    major = forms.TypedChoiceField(choices=MAJOR_CHOICES, label='专业')
    school = forms.CharField(max_length=20)

    """
    image = forms.ImageField()
    resume = forms.FileField()
    """
