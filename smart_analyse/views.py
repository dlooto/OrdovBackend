from django.shortcuts import render
from django.db import models

from resumes.models import Resume, Tag2, ResumeTag
from companies.models import Post, PostTag2, PostTag
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from .models import CandidatePostMatchScore

# Create your views here.

def UpdateCandidatePostMatchInfo(resume_id):
    allPost = Post.objects.all()
    resume = Resume.objects.get(id=resume_id);
    print("Enter .UpdateCandidatePostMatchInfo.")
    for post in allPost:
        postId = post.id
        postName = post.name
        scoreForCurrentPost = 0
        postTags = PostTag.objects.filter(post_id=postId)
        for pt in postTags:
            rootTag = pt.rootTag.id
            subTag = pt.subTag.id
            candidateTag = ResumeTag.objects.filter(models.Q(resume_id=resume_id) &
                                               models.Q(rootTag__id=rootTag) &
                                               models.Q(subTag__id=subTag))
            print("Update Score For " + resume.username + " jobname:" + postName)
            print(candidateTag)
            if len(candidateTag) == 0:
                continue

            item = candidateTag[0]
            scoreForCurrentPost += item.score
            qset = CandidatePostMatchScore.objects.filter(models.Q(resume_id=resume_id) &
                                                  models.Q(post_id=postId))
            if len(qset) == 0:
                print("Create CandidatePostMatchScore For" + resume.username + " jobname:" + postName)
                print("score: "+ str(scoreForCurrentPost))
                CandidatePostMatchScore.objects.create(
                            resume_id=resume_id,
                            post_id=postId,
                            score=scoreForCurrentPost)
            else:
                print("Update CandidatePostMatchScore" + resume.username + " jobname:" + postName)
                print("score: "+ str(scoreForCurrentPost))
                qset[0].score = scoreForCurrentPost
                qset[0].save()
