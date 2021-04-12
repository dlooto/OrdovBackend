from django.shortcuts import render
import json

# Create your views here.
from .baiying import api as baiying

def getBaiyingTaskList():

    # Step1: to get the company id
    """
    company_list_str = baiying.get_companys()
    company_json = json.loads(company_list_str)
    company_list = company_json.get('data')
    #print("company_list", company_list_str.decode(encoding='utf-8'))
    if company_list is None:
        return None
    company_id = company_list[0].get('companyId')
    print("company_id: ", company_id)
    """
    company_id = 15960

    # Step2: to get the task list
    task_list_str = baiying.getCompanyTaskList(company_id)
    task_json = json.loads(task_list_str)
    if task_json.get('data') is None or task_json.get('data').get('list') is None:
        return None
    task_list = task_json.get('data').get('list')
    taskList = []
    for task in task_list:
        item = [task.get('callJobId'), task.get('jobName'), task.get('jobName') +"-"+ str(task.get('callJobId'))]
        taskList.append(item)
    return taskList
    
    # Step3: 

def importTaskCustomer(companyId, taskId, username, phone_number):
    baiying.importTaskCustomer(companyId, taskId, username, phone_number)

def get_ai_info(callJobId, phone_number):
    return baiying.get_ai_info(callJobId, phone_number)

def get_job_instances2(callJobId, pageNum, pageSize):
    return baiying.get_job_instances2(callJobId, pageNum, pageSize)
def get_instance_info(instanceId):
    return baiying.get_instance_info(instanceId)
def get_num_of_instances(instanceId):
    return baiying.get_num_of_instances(instanceId)
