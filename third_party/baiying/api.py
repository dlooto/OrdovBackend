import hmac
import base64
import urllib
import datetime
import urllib.request
import urllib.parse
import json
import os
from .open_sdk_python_master.byclient import BYClient
from .open_sdk_python_master import auth
import sys
import requests

# ak 需要获取
appKey = 'prVWMqVAjtDxtEb6'
appSecrete = '5OVSohXpJI4T0zxqVG7yQqJBxnqOgg'

# 百应线上环境api访问地址
BASE_URL = "http://api.byrobot.cn"

def get_companys():
    # GMT时间获取
    GMT_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'
    time_format_gmt = (datetime.datetime.now() - datetime.timedelta(hours=8)).strftime(GMT_FORMAT)

    # 签名计算
    signMessage = appKey + '\n' + time_format_gmt
    quote = base64.b64encode(
        hmac.new(bytes(appSecrete.encode("utf-8")), bytes(signMessage.encode("utf-8")), digestmod='sha1').digest()).decode("utf-8")

    request_obj = urllib.request.Request(url=BASE_URL + "/openapi/v1/company/getCompanys")
    request_obj.add_header("sign", quote)
    request_obj.add_header("datetime", time_format_gmt)
    request_obj.add_header("appkey", appKey)
    response_obj = urllib.request.urlopen(request_obj)
    html_code = response_obj.read().decode('utf-8')
    jsonjson = json.loads(html_code)
    print(html_code)
    #print("jsonjson%s"%(jsonjson.get('resultMsg').encode('utf-8').decode('gbk')))
    return html_code


def get_phones(companyId):
    GMT_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'
    time_format_gmt = (datetime.datetime.now() - datetime.timedelta(hours=8)).strftime(GMT_FORMAT)
    signMessage = appKey + '\n' + time_format_gmt
    quote = base64.b64encode(
        hmac.new(bytes(appSecrete.encode("utf-8")), bytes(signMessage.encode("utf-8")), digestmod='sha1').digest()).decode("utf-8")

    request_obj = urllib.request.Request(url=BASE_URL + "/openapi/v1/company/getPhones?" + str(companyId))
    request_obj.add_header("sign", quote)
    request_obj.add_header("datetime", time_format_gmt)
    request_obj.add_header("appkey", appKey)
    response_obj = urllib.request.urlopen(request_obj)
    html_code = response_obj.read().decode('utf-8')
    return html_code


def getRobots(companyId):
    GMT_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'
    time_format_gmt = (datetime.datetime.now() - datetime.timedelta(hours=8)).strftime(GMT_FORMAT)
    signMessage = appKey + '\n' + time_format_gmt
    quote = base64.b64encode(
        hmac.new(bytes(appSecrete.encode("utf-8")), bytes(signMessage.encode("utf-8")), digestmod='sha1').digest()).decode("utf-8")

    request_obj = urllib.request.Request(url=BASE_URL + "/openapi/v1/company/getRobots?companyId=" + str(companyId))

    request_obj.add_header("sign", quote)
    request_obj.add_header("datetime", time_format_gmt)
    request_obj.add_header("appkey", appKey)

    response_obj = urllib.request.urlopen(request_obj)
    html_code = response_obj.read().decode('utf-8')
    return html_code

# 获取一个公司的所有任务的列表
def getCompanyTaskList(companyId):
    GMT_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'
    time_format_gmt = (datetime.datetime.now() - datetime.timedelta(hours=8)).strftime(GMT_FORMAT)
    signMessage = appKey + '\n' + time_format_gmt
    quote = base64.b64encode(
        hmac.new(bytes(appSecrete.encode("utf-8")), bytes(signMessage.encode("utf-8")), digestmod='sha1').digest()).decode("utf-8")

    request_obj = urllib.request.Request(BASE_URL + "/openapi/v1/task/getTasks?companyId=" + str(companyId)+"&pageSize=100")

    request_obj.add_header("sign", quote)
    request_obj.add_header("datetime", time_format_gmt)
    request_obj.add_header("appkey", appKey)

    response_obj = urllib.request.urlopen(request_obj)
    html_code = response_obj.read().decode('utf-8')
    return html_code

def post_create_job():
    GMT_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'
    time_format_gmt = (datetime.datetime.now() - datetime.timedelta(hours=8)).strftime(GMT_FORMAT)
    signMessage = appKey + '\n' + time_format_gmt
    quote = base64.b64encode(
        hmac.new(bytes(appSecrete.encode("utf-8")), bytes(signMessage.encode("utf-8")), digestmod='sha1').digest()).decode("utf-8")
    textmod = {
          "companyId" : 15960,
          "taskName" : "测试任务",
          "taskType" : 2,
          "startDate" : "2019-06-09",
          "workingStartTime" : "08:00",
          "workingEndTime" : "22:00",
          "breakStartTime":"12:00",
          "breakEndTime":"14:00",
          "userPhoneIds" : [47451,47452,47453,53109],
          "callType" : 1,
          "concurrencyQuota" :1,
          "robotDefId" : 71095,
          "sceneDefId" : 1,
          "sceneRecordId" : 7,
          "remark" : "创建任务"
      }
    textmod = json.dumps(textmod).encode(encoding='utf-8')
    print(textmod)
    header_dict = {"Content-Type": "application/json"}
    req = urllib.request.Request(url=BASE_URL+'/openapi/v1/task/createTask', data=textmod, headers=header_dict)
    req.add_header("sign", quote)
    req.add_header("datetime", time_format_gmt)
    req.add_header("appkey", appKey)
    res = urllib.request.urlopen(req)
    res = res.read()
    print("post_create_job", res.decode(encoding='utf-8'))



def getDoneTaskPhone(calljobId):
    GMT_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'
    time_format_gmt = (datetime.datetime.now() - datetime.timedelta(hours=8)).strftime(GMT_FORMAT)
    signMessage = appKey + '\n' + time_format_gmt
    quote = base64.b64encode(
        hmac.new(bytes(appSecrete.encode("utf-8")), bytes(signMessage.encode("utf-8")), digestmod='sha1').digest()).decode("utf-8")

    taskInfo = {
		"callJobId" : calljobId
    }

    json_result = json.dumps(taskInfo).encode(encoding='utf-8')
    header_dict = {"Content-Type": "application/json"}
    request_obj = urllib.request.Request(url=BASE_URL + "/openapi/v1/task/queryDoneTaskPhones", data=json_result, headers=header_dict)

    request_obj.add_header("sign", quote)
    request_obj.add_header("datetime", time_format_gmt)
    request_obj.add_header("appkey", appKey)

    response_obj = urllib.request.urlopen(request_obj)
    html_code = response_obj.read().decode('utf-8')

    return html_code

def importTaskCustomer(companyId, taskId, username, phone_number):
    GMT_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'
    time_format_gmt = (datetime.datetime.now() - datetime.timedelta(hours=8)).strftime(GMT_FORMAT)
    signMessage = appKey + '\n' + time_format_gmt
    quote = base64.b64encode(
        hmac.new(bytes(appSecrete.encode("utf-8")), bytes(signMessage.encode("utf-8")), digestmod='sha1').digest()).decode("utf-8")

    taskInfo = {
        "companyId": companyId,
        "taskId": taskId,
        "customerInfoList":[
            {
                "name":username,
                "phone": phone_number
            },
        ]
    }

    json_result = json.dumps(taskInfo).encode(encoding='utf-8')
    header_dict = {"Content-Type": "application/json"}
    request_obj = urllib.request.Request(url=BASE_URL + "/openapi/v2/task/importTaskCustomer", data=json_result, headers=header_dict)

    request_obj.add_header("sign", quote)
    request_obj.add_header("datetime", time_format_gmt)
    request_obj.add_header("appkey", appKey)

    response_obj = urllib.request.urlopen(request_obj)
    html_code = response_obj.read().decode('utf-8')
    print("importTaskCustomer: ", html_code)

def get_token(companyId):
    base_url="https://open.byai.com/oauth/token"
    url2=base_url+"?client_id="+appKey+"&client_secret="+appSecrete+"&company_id="+str(companyId)
    headers = {"Content-Type":"application/x-www-form-urlencoded"}
    rsp = requests.post(url2, headers=headers)
    if rsp.status_code == 200:
        data = json.loads(str(rsp.content.decode("utf-8")))
        config = data.get("data", None)
        if config is not None:
            return config.get("access_token",None)
    return None


def get_job_instances(callJobId):
	token = get_token(15960)
	if token is not None:
		token = auth.Token(token=token)
		client = BYClient(token)
		params = {
			"callJobId": callJobId,
			"companyId": 15960,
		}
		info = str(client.invoke('byai.openapi.calljob.calldone.list', '1.0.0', 'GET', params=params), encoding="utf-8")
		if info != "":
			return json.loads(info)
	return None

def get_job_instances2(callJobId, pageNum, pageSize):
    token = get_token(15960)
    if token is not None:
        token = auth.Token(token=token)
        client = BYClient(token)
        params = {
            "callJobId": callJobId,
            "companyId": 15960,
            "pageNum": pageNum,
            "pageSize": pageSize
        }
        info = str(client.invoke('byai.openapi.calljob.calldone.list', '1.0.0', 'GET', params=params), encoding="utf-8")
        if info != "":
            return json.loads(info)
    return None

def get_num_of_instances(callJobId):
    token = get_token(15960)
    info = get_job_instances2(callJobId, 1, 1)
    try:
        return info["data"]["total"]
    except:
        return -1


def get_instance_info(callInstanceId):
    token = get_token(15960)
    if token is not None:
        token = auth.Token(token=token)
        client = BYClient(token)
        params = {
            "callInstanceId": callInstanceId,
            "companyId": 15960,
        }
        info = str(client.invoke('byai.openapi.callinstance.detail.get', '1.0.0', 'GET', params=params), encoding="utf-8")
        if info != "":
            pJson = json.loads(info)
            phoneLog = ""
            try:
                logList = pJson["data"]["phoneLogs"]
                for item in logList:
                    phoneLog = phoneLog +  item.get("speaker", "NONE") + ":" + item.get("content", "") + "\n"
                pInstance = pJson["data"]["callInstance"]
                taskResult = pJson["data"]["taskResult"]
                tags = ""
                for it in taskResult:
                    tempTags = it.get("resultLabels")
                    for it2 in tempTags:
                        tags = tags + it2.get("value") + ";"
                        #tags = tags + '''str(it2.get("key", -1)) + ":" + '''it2.get("value") + ";"
                print("tags", tags)
                return phoneLog, str(pInstance.get("duration", -1)) + "s", pInstance.get("jobName", "UnKnown"), tags
            except:
                return "", "", "", ""
    return "", "", "", ""

def get_ai_info(callJobId, phone_number):
    instanceId = get_instanceId(callJobId, phone_number)
    instanceInfo = get_instance_info(instanceId)
    if instanceInfo is not None:
        data = instanceInfo.get('data', None)
        if data is None:
            print("No data")
            return None
        pLogs = data.get('phoneLogs', None)
        result = ""
        for item in pLogs:
           result = result + item.get("speaker") +": "+ item.get("content")+ "\n"
        return result
    return ""

def get_instanceId(callJobId, phone_number):
    instances = get_job_instances(callJobId)
    if instances is not None:
        data = instances.get('data', None)
        if data is None:
            print("No data")
            return None
        iList = data.get('list', None)
        if iList is None:
            print("No List")
            return None
        for i in iList:
            if i.get("customerTelephone", "00000000000") == phone_number:
                print("Found ", i.get("callInstanceId"))
                return i.get("callInstanceId")
    else:
        print("Fail to get the instance info", callJobId, phone_number)
