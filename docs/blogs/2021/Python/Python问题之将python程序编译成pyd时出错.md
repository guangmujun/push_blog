---
title: Python问题之将python程序编译成pyd时出错
date: 2019-10-30
permalink: /python-problem-error-in-python-exe-pyd.html
tags:
 - Python
 - Print
 - Pyd 
categories:
 - Python
---

## 错误信息

`print('Hello', flush=True) ` 程序中使用print函数，并且设置其flush参数，cython编译时便会报错 `Error
compiling Cython file:Expected ')', found '=' `

## 解决办法

It looks like cython treats all prints as python 2 statements by default. In
order to use the python 3 print function you need to import it from the
**future** module: `from **future** import print_function ` 补充：并且这一句要放到程序的开头

