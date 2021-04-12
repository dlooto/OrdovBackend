from django.db import models

# Create your models here.
from resumes.models import Resume
from companies.models import Area, Post

class ExpectArea(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, default='')
    area = models.ForeignKey(Area, on_delete=models.CASCADE, default='')

class CandidatePostMatchScore(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, default='')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, default='')
    score = models.IntegerField(null=True)

    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
