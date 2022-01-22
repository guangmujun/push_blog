---
title: Python学习之os.listdir()的使用和文件批量重命名方法
date: 2019-08-14
permalink: /python-learning-os-list-dir-file-rename.html
tags:
 - Python
 - listdir
categories:
 - Python
---



### 作用

返回指定文件夹路径下的文件名称列表

### 用法

    path_name = './image'               #文件夹路径
    files = os.listdir(path_name)       #路径下的文件名称列表


### 注意

返回的files列表中，文件是乱序放置的

### 排序

在上述代码后，加上

    files.sort(key=lambda x:int(x[:-4]))


上述代码意思是： 对于文件名称，按照从右往左数第四位左边的文件名进行升序排序，目的是避开文件的后缀名。

### 文件批量重命名

对文件重命名，以数字作为文件名称，数字递增来实现批量命名。

    import os
    path_name = './images'
    i = 0
    for item in os.listdir(path_name):
        os.rename(os.path.join(path_name,item),os.path.join(path_name,(str(i)+'.jpg')))#os.path.join(path_name,item)
        i += 1


### 参考

> https://blog.csdn.net/wearge/article/details/77374150

