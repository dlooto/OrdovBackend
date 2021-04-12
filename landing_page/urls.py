from django.urls import path

from landing_page import views

app_name = 'app_landing'
urlpatterns = [
    # ex: /landing_page/
    path('', views.index, name='t_index'), # t_index will be used in template
]
