from django.db import models
from companies.models import Post
from accounts.models import UserProfile


# Create your models here.
class ProjectPermission(models.Model):
    """ 
    Project Permission must be link
    """
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    stage = models.IntegerField(default=-1)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
