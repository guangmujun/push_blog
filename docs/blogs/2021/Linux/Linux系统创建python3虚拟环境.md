---
title: Linux系统创建python3虚拟环境
date: 2019-08-14
permalink: /linux-install-python.html
tags:
 - Linux
 - Python
 - CentOS 
categories:
 - Linux
---




### 创建Python3虚拟环境

使用python3解释器，创建虚拟环境


​    
    virtualenv -p /usr/bin/python3 env3


开启虚拟环境


​    
    source env3/bin/activate


运行代码


​    
    python3 xxx.py


关闭虚拟环境


​    
    source env3/bin/deactivate

