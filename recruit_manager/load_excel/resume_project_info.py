from resume_template import iPos
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from experiences.models import Project
from experiences.serializers import ProjectSerializer
def update_project_info(resume, phone):

    # step1: get the raw data
    proj_start = resume[iPos['PROJECT_START_TIME']].strip()
    proj_end = resume[iPos['PROJECT_END_TIME']].strip()
    proj_name = resume[iPos['PROJECT_NAME']].strip()
    proj_brief = resume[iPos['PROJECT_BRIEF']].strip()
    proj_scale = resume[iPos['PROJECT_SCALE']].strip()
    proj_role = resume[iPos['PROJECT_ROLE']].strip()
    proj_company = resume[iPos['PROJECT_COMPANY']].strip()
    proj_zhize = resume[iPos['PROJECT_ZHIZE']].strip()
    proj_summary = resume[iPos['PROJECT_SUMMARY']].strip()

    # step2: refresh data
    # step3: create experience data
    resumeTarget = None
    try:
        resumeTarget = Resume.objects.get(phone_number=phone)
    except (ObjectDoesNotExist, MultipleObjectsReturned):
        print("Update Project: There Should be One Resume, Return")
        return

    project = {
        "resume": resumeTarget.id,
        "start": proj_start,
        "end": proj_end,
        "name": proj_name,
        "brief": proj_brief,
        "scale": proj_scale,
        "role": proj_role,
        "company_name": proj_company,
        "duty": proj_zhize,
        "summary": proj_summary,
    }

    serializer = ProjectSerializer(data=project)
    if serializer.is_valid(raise_exception=True):
        project_saved = serializer.save()
    else:
        print("Fail to serilize project")
