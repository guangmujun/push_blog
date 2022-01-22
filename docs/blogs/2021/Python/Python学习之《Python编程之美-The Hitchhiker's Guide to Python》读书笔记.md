---
title: Python学习之《Python编程之美-The Hitchhiker's Guide to Python》读书笔记
date: 2020-10-16
permalink: /python-learning-guide-to-python.html
tags:
 - Python
 - 教程
categories:
 - Python
---




## CH1 选择解释器

## CH2 安装Python

  1. 导出依赖 
        
        ```shell
        pip freeze > requirements.txt
        ```


  2. 安装依赖 
        
        ```shell
        pip install -r requirements.txt
        ```


## CH3 搭建环境

## CH4 编写高质量代码

  1. 参数传递给函数的方式 
        
            ```shell
            def func(positional, keyword=value, *args, **kwargs):
            pass
            ```


    * 位置参数：强制性，无默认值
    * 关键字参数：可选，有默认值
    * 任意数量参数列表：可选，无默认值
    * 任意数量关键字参数字典：可选，无默认值
  2. 任何不开放给外部使用的方法或属性，都应该带上下划线前缀
  3. 操作列表

    a = [3, 4, 5, 6]
    print([i for i in a if i > 4])
    print(list(filter(lambda x: x >4, a)))
    print(list(map(lambda x: x > 4, a)))


​    
​    
​    [5, 6]
​    [5, 6]
​    [False, False, True, True]


​    
​    
​    b = ['icky', 'wang', 'yu', 'hang']
​    for i, item in enumerate(b):
​        print('{i}:{item}'.format(i=i, item=item))


​    
​    
​    0:icky
​    1:wang
​    2:yu
​    3:hang


  4. 解包


​    
​    a, *rest = [1, 2, 3]
​    print(a)
​    print(rest)


​    
​    
​    1
​    [2, 3]


​    
​    
​    a, *middle, c = [1,2,3,4]
​    print(a)
​    print


  5. logging

print到控制台的数据，保存到log文件中

    import sys
    f = open('a.log', 'a')
    sys.stdout = f
    sys.stderr = f
    
    print('xxxxxxxxxxxx')


## CH7 用户交互

  1. Django 

    * 提供大量开箱即用的工具和模式，以快速构建复杂、数据库支持Web应用为目标
  2. Flask 

    * 构建小型应用、API或Web服务

## CH8 代码管理和改进

  1. 加速程序运行的方案 

    * threading
    * multiprocessing/subprocess
    * PyPy
    * Cython

## 总结

这是一本概述类型的书，只是让你对Python相关的技术有个简单的了解，进一步学习话就要去需要阅读相关方向的详细介绍书籍。

