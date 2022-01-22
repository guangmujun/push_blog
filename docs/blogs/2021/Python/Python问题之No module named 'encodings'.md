---
title: Python问题之No module named 'encodings'
date: 2020-03-31
permalink: /python-problem-numpy-show-config.html
tags:
 - Python
 - 问题 
categories:
 - Python
---



  1. 报错信息 运行你的python程序，出现以下的报错信息：

    Fatal Python error: Py_Initialize: Unable to get the locale encoding
    ImportError: No module named 'encodings'
    ModuleNotFoundError: No module named 'encodings'


  2. 原因 之前用的python解释器被你卸载了，新安装的python与之前的版本不一样。

  3. 解决办法 

    * 在新的python环境下安装相关的库后，再运行
    * 或者卸载现在的python解释器，重新装回原来版本的python

