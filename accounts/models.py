# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from allauth.account.models import EmailAddress
from django.db.models.signals import post_save
from django.core import signing
from django.core.signing import SignatureExpired, BadSignature

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(
            choices = (('Candidate', 'Candidate'), ('Recruiter', 'Recruiter'), ('Employer', 'Employer'), ('Manager', 'Manager')),
            max_length=50,
    )
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return self.user.username

    def generate_token(self):
        email = self.user.email
        token = signing.dumps({'email': email})
        return token

    @staticmethod
    def verify_token(token, max_age=604800):
        # default max_age is 7 days
        if token is None:
            return None
        try:
            value = signing.loads(token, max_age=max_age)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        user = User.objects.get(email=value['email'])
        return user

"""
def create_account_emailaddress(sender, instance, created, **kwargs):
    # Used for django-allauth
    if created:
        EmailAddress.objects.get_or_create(
            user_id = instance.id
            email = instance.email
        )
"""
def create_account_emailaddress(sender, instance, created, **kwargs):
    # Used for django-allauth
    pass

post_save.connect(create_account_emailaddress, sender=User)
