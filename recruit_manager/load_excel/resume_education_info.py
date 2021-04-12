from .resume_template import iPos
from resumes.models import Resume
from resumes.models import Education

from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from resumes.serializers import EducationSerializer
from .common import validate_date, validate_degree, validate_edu_type

def update_education_info(resume, phone):
    if phone is "":
        return
    # step1: get raw data
    edu_start = str(resume[iPos['EDUCATION_START_TIME']]).strip()
    edu_end = str(resume[iPos['EDUCATION_END_TIME']]).strip()
    edu_school = str(resume[iPos['EDUCATION_SCHOOL']]).strip()
    edu_colleage = str(resume[iPos['EDUCATION_COLLEGE']]).strip()
    edu_major = str(resume[iPos['EDUCATION_MAJOR']]).strip()
    edu_type = str(resume[iPos['EDUCATION_TYPE']]).strip()
    degree = str(resume[iPos['EDUCATION_DEGREE']]).strip()
    edu_reference = str(resume[iPos['EDUCATION_REFERENCE']]).strip()
    edu_reference_phone = str(resume[iPos['EDUCATION_REFERENCE_PHONE']]).strip()
    edu_province = str(resume[iPos['EDUCATION_PROVICE']]).strip()
    edu_city = str(resume[iPos['EDUCATION_CITY']]).strip()
    edu_district = str(resume[iPos['EDUCATION_DISTRICT']]).strip()
    edu_street = str(resume[iPos['EDUCATION_STREET']]).strip()

    # step2: refresh data
    print("pre edu_start:", edu_start, "|")
    print("pre edu_end:", edu_end, "|")
    edu_start = validate_date(edu_start)
    edu_end = validate_date(edu_end)
    degreeNO = validate_degree(degree)
    edu_type = validate_edu_type(edu_type)

    print("edu_start:", edu_start, "|")
    print("edu_end:", edu_end, "|")
    # step3: create education info

    resumeTarget = None
    try:
        resumeTarget = Resume.objects.get(phone_number=phone)
    except (ObjectDoesNotExist, MultipleObjectsReturned):
        print("Update Education: There Should Be One Resume, Return")
        return

    print("resumeTarget", resumeTarget)
    print("edu_start: ", edu_start, " edu_end:", edu_end)

    #"resume" : resumeTarget,
    education = {
        "resume" : resumeTarget.id,
        "start" : edu_start,
        "end" : edu_end,

        "school" : edu_school,
        "college" : edu_colleage,
        "major" : edu_major,
        "degree" : degreeNO,
        "edu_type" : edu_type,

        "province" : edu_province,
        "city" : edu_city,
        "district" : edu_district,
        "street" : edu_street,
        "place" : edu_province + edu_city + edu_district + edu_street,

        "instructor" : edu_reference,
        "instructor_phone" : edu_reference_phone,
    }

    serializer = EducationSerializer(data=education)
    if serializer.is_valid(raise_exception=True):
        education_saved = serializer.save()
    else:
        print("Fail to serilize education")
