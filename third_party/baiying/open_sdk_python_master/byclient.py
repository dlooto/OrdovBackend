# coding=utf-8
import requests


####################################
#
#   百应开放平台SDK - Python 1.0.0
#
#      三方库依赖: requests
#
####################################

class BYClient:
    def __init__(self, authorize):
        self.auth = authorize

    def invoke(self, apiName, version, method, params={}, files={}):
        http_url = 'https://open.byai.com'
        service = apiName[0: apiName.rindex('.')]
        action = apiName[apiName.rindex('.') + 1: len(apiName)]

        param_map = {'v': '1.0.0'}
        http_url += '/api/oauth'
        param_map['accessToken'] = self.auth.get_token()
        param_map = dict(**param_map, **params)
        http_url = http_url + '/' + service + '/' + version + '/' + action

        resp = self.send_request(http_url, method, param_map, files)
        if resp.status_code != 200:
            print(resp.status_code)
            raise Exception('Invoke failed')
        return resp.content

    def send_request(self, url, method, param_map, files):
        headers_map = {
            'User-Agent': 'X-BY-Client 1.0.0 - Python'
        }
        if method.upper() == 'GET':
            return requests.get(url=url, params=param_map, headers=headers_map)
        elif method.upper() == 'POST':
            return requests.post(url=url, data=param_map, files=files, headers=headers_map)
