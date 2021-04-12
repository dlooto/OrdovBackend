from .resume_template import iPos
from resumes.models import Resume

from experiences.serializers import ExperienceSerializer
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from .common import validate_date, validate_salary


def update_experience_info(resume, phone):

    # step1: get the raw data
    exp_start = str(resume[iPos['EXPERIENCE_START_TIME']]).strip()
    exp_end = str(resume[iPos['EXPERIENCE_END_TIME']]).strip()
    exp_company = str(resume[iPos['EXPERIENCE_COMPANY_NAME']]).strip()

    if exp_company == '':
        print("exp_company is null, Return")
        return

    exp_company_short = str(resume[iPos['EXPERIENCE_COMPANY_SHORT_NAME']]).strip()
    exp_department = str(resume[iPos['EXPERIENCE_DEPARTMENT']]).strip()
    exp_post_name = str(resume[iPos['EXPERIENCE_POST_NAME']]).strip()
    exp_post_class = str(resume[iPos['EXPERIENCE_POST_CLASS']]).strip()
    exp_post_type = str(resume[iPos['EXPERIENCE_POST_TYPE']]).strip()
    exp_post_rank = str(resume[iPos['EXPERIENCE_POST_RANK']]).strip()
    exp_post_feature = str(resume[iPos['EXPERIENCE_POST_FEATURE']]).strip()
    exp_post_subornates = resume[iPos['EXPERIENCE_POST_SUBORNATES']]
    exp_post_duty = str(resume[iPos['EXPERIENCE_POST_DUTY']]).strip()
    exp_post_summary = str(resume[iPos['EXPERIENCE_POST_SUMMARY']]).strip()
    exp_post_base_salary = str(resume[iPos['EXPERIENCE_POST_BASE_SALARY']]).strip()
    exp_post_deduct_salary = str(resume[iPos['EXPERIENCE_POST_DEDUCT_SALARY']]).strip()
    exp_post_zuoxi = str(resume[iPos['EXPERIENCE_POST_ZUOXI']]).strip()
    exp_post_leave_reason = str(resume[iPos['EXPERIENCE_POST_LEAVE_REASON']]).strip()
    exp_post_province = str(resume[iPos['EXPERIENCE_POST_PROVICE']]).strip()
    exp_post_city = str(resume[iPos['EXPERIENCE_POST_CITY']]).strip()
    exp_post_district = str(resume[iPos['EXPERIENCE_POST_DISTRICT']]).strip()

    exp_post_reference = str(resume[iPos['EXPERIENCE_POST_REFERENCE']]).strip()
    exp_post_reference_post = str(resume[iPos['EXPERIENCE_POST_REFERENCE_POST']]).strip()
    exp_post_reference_phone = str(resume[iPos['EXPERIENCE_POST_REFERENCE_PHONE']]).strip()

    # step2: refresh data
    exp_start = validate_date(exp_start)
    exp_end = validate_date(exp_end)
    print("salary: ", exp_post_base_salary)
    exp_post_base_salary = validate_salary(exp_post_base_salary)
    exp_post_deduct_salary = validate_salary(exp_post_deduct_salary)

    # step3: create experience data
    resumeTarget = None
    try:
        resumeTarget = Resume.objects.get(phone_number=phone)
    except (ObjectDoesNotExist, MultipleObjectsReturned):
        print("Update Experience: There Should Be One Resume, Return")
        return
    experience = {
        "resume" : resumeTarget.id,
        "start" : exp_start,
        "end" : exp_end,
        "company_name" : exp_company,
        "department_name" : exp_department,
        "post_name" : exp_post_name,

        "p_type" : exp_post_type,
        "p_feature" : exp_post_feature,

        "subornates" : exp_post_subornates,
        "level" : exp_post_rank,
        "duty" : exp_post_duty,
        "salary" : exp_post_base_salary,
        "deduct_salary" : exp_post_deduct_salary,

        "shift" : exp_post_zuoxi,
        "leave_reason" : exp_post_leave_reason,

        "work_province" : exp_post_province,
        "work_city" : exp_post_city,
        "work_district" : exp_post_district,

        "witness" : exp_post_reference,
        "witness_post" : exp_post_reference_post,
        "witness_phone" : exp_post_reference_phone,
    }

    serializer = ExperienceSerializer(data=experience)
    if serializer.is_valid(raise_exception=True):
        experience_saved = serializer.save()
    else:
        print("Fail to serilize experience")
