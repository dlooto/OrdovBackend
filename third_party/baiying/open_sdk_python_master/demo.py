# coding=utf-8
import sys
import auth
from byclient import BYClient

if __name__ == '__main__':
    # 免签名token模式调用
    token = auth.Token(token='84ed66084ece317c9410ae00dbc4a69b')
    client = BYClient(token)

    params = {}
    print(str(client.invoke('byai.openapi.company.list', '1.0.0', 'GET', params=params), encoding="utf-8"))