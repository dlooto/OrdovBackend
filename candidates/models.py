# -*- encoding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class Candidate(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default='', blank=True, null=True)
    interviewed = models.BooleanField(default=False, blank=True, null=True)
    def __str__ (self):
        if self.user:
            return self.user.username
        else:
            return "Anonymous"
