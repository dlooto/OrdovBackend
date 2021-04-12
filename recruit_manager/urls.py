from django.urls import path

from recruit_manager import views
from resumes import views as resumesViews
from companies import views as companiesViews
from interviews import views as interviewsViews

app_name = 'app_manager'

# Look at Here!! : All path pattern should be ENDUP with '/'
urlpatterns = [
    # ex: /manager/
    path('', views.index, name='t_index'), # t_index will be used in template
    path('upload/', views.upload, name='t_upload'),
    path('candidates/', views.CandidateTable.as_view(), name='t_candidates'),

    path('interviews/', interviewsViews.InterviewTable.as_view(), name='t_interviews'),

    path('interview-api/<int:resume_id>/<int:interview_id>/', views.interview_api, name='t_interview_api'),
    path('interview-result/<int:interview_id>/', views.interview_result, name='t_interview_result'),

    path('invitation-api/<int:resume_id>/', views.invitation_api, name='t_invitation_api'),
    path('invitation-result/<int:resume_id>/', views.invitation_result, name='t_invitation_result'),
    path('resumes/statistic/<int:post_id>/', views.resume_statistic, name='t_resume_statistic'),


    path('resumes/', resumesViews.ResumeTable.as_view(), name='t_resumes'),
    path('multi/', resumesViews.MultiTable.as_view(), name='t_multi'),
    path('multi/callInterview', views.callInterview, name='t_callInterview'),
    path('multi/test', views.callInterview, name='t_callInterview'),
    path('composite/', resumesViews.CompositeTable.as_view(), name='t_composite'),
    path('resumes/<int:pk>/', resumesViews.ResumeDetailInfo, name='t_resume'),
    path('resumes/<int:pk>/edit/', resumesViews.ResumeDetailInfo, name='t_resume_edit'),
    path('posts/', companiesViews.PostTable.as_view(), name='t_posts'),

    path('tags/', resumesViews.Tag2Table.as_view(), name='t_tags'),
]
