## 介绍
+ 百应开放平台Python版本的SDK，v1.0.0

## 环境

```
python版本:  >= 2.7, < 3.0
三方库依赖: requests, 可以借助开源工具pip安装，pip install requests
```

## 引用包
```
import auth
from byclient import BYClient
```

## 如何使用？（参考demo.py）
### 调用byai.openapi.company.list.1.0.0接口

```
token = auth.Token(token='${token}')
client = BYClient(token)
print client.invoke('byai.openapi.company.list', '1.0.0', 'GET')
```