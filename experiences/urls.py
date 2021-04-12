from django.urls import path

from .views import ExperienceView


app_name = "experiences"

# app_name will help us do a reverse look-up latter.
urlpatterns = [
    path('experiences/', ExperienceView.as_view()),
]
