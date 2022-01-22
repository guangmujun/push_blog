---
title: Python学习之zip()函数的使用
date: 2019-08-14
permalink: /python-learning-zip.html
tags:
 - Python
 - Zip
categories:
 - Python

---



在python 3.0中zip()是可迭代对象，使用时必须将其包含在一个list中，方便一次性显示出所有结果。


​    
    >>> t = ['a','b','c']
    >>> m = [5,4,9]
    >>> zip(t,m)
    
    >>> list(zip(t,m))
    [('a', 5), ('b', 4), ('c', 9)]


脚本中使用`print(list(zip(t,m)))`，运行时即可打印出结果。

