from django.urls import path

from recruit_applicant import views

app_name = 'app_applicant'
urlpatterns = [
    path('', views.index, name='t_index'), # t_index will be used in template
]
