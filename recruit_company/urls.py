from django.urls import path

from recruit_company import views

app_name = 'app_company'
urlpatterns = [
    path('', views.index, name='t_index'), # t_index will be used in template
]
