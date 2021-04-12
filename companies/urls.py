from django.urls import path

from .views import CompanyView, DepartmentView, PostView

app_name = "companies"

# app_name will help us do a reverse look-up latter.
urlpatterns = [
    path('companies/', CompanyView.as_view()),
    path('departments/', DepartmentView.as_view()),
    path('posts/', PostView.as_view()),
]
