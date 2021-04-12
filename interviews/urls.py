from django.urls import include, path

from rest_framework import routers
from .views import InterviewSub_AppointmentViewSet
from .views import InterviewSub_InterviewViewSet
from .views import InterviewSub_OfferViewSet
from .views import InterviewSub_Probation_FailViewSet
from .views import InterviewSub_PaybackViewSet, InterviewSub_Payback_FinishViewSet
from .views import InterviewSub_TerminateViewSet
from interviews import views

router = routers.DefaultRouter()

router.register(r'appointment_sub', InterviewSub_AppointmentViewSet)

router.register(r'interview_sub', InterviewSub_InterviewViewSet)

router.register(r'offer_sub', InterviewSub_OfferViewSet)

router.register(r'probation_sub_fail', InterviewSub_Probation_FailViewSet)

router.register(r'payback_sub', InterviewSub_PaybackViewSet)
router.register(r'payback_sub_finish', InterviewSub_Payback_FinishViewSet)

router.register(r'terminate_sub', InterviewSub_TerminateViewSet)

app_name = "interviews"

# app_name will help us do a reverse look-up latter.
urlpatterns = [
    path('api/', include(router.urls)),
    path('sub/offer/<int:interview_id>/', views.interviewsub_get_offer_detail, name='t_interviewsub_offer'),
]
