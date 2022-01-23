---
title: Flask学习之F1 环境中导入敏感信息
date: 2021-03-14
permalink: /flask-learning-import-info-from-env.html
tags:
 - Flask
 - 环境
categories:
 - Flask
---



# F1环境中导入敏感信息

## 1.1 前言

> 项目地址：https://gitee.com/guangmujun/micro-blog 个人网站：https://guangmujun.cn
> MySQL学习：https://guangmujun.cn/archives/category/learning-note/mysql-note
> 参考：https://www.cnblogs.com/We612/p/11331401.html

当你计划开源自己的项目时，将相关的账号和密码直接写入脚本的话，就会泄露你的信息
为保护账户信息，可以将敏感信息写入到本地的环境变量中，然后让脚本从环境中导入敏感信息

## 1.2 设置从环境导入变量值


​    
    import os 
    
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')


## 1.3 设置环境变量值

  1. 设置变量值


​    
    set SECRET_KEY = 'your secret key'
    set SQLALCHEMY_DATABASE_URI = 'mysql://{user}:{password}@{server}/{database}'.format(
                                    user='your-username', password='your-password', server='your-ip-port', database='your-database')


  2. 查看变量值


​    
    >set SECRET_KEY
    SECRET_KEY = 'your secret key'
    
    >set SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_DATABASE_URI = 'mysql://{user}:{password}@{server}/{database}'.format(
                                    user='your-username', password='your-password', server='your-ip-port', database='your-database')


**注意：**

  * 使用set命令设置的环境变量，都是 **临时性** 的，当前的命令行窗口关闭后，使用set设置的环境变量的值就会消失

## 1.4 运行脚本


​    
    python hello.py runserver


**注意：**

  * 运行脚本和设置环境变量要使用同一个命令行窗口

## 1.5 Pycharm中配置环境变量

替代前述的1.3和1.4步骤，按照下图步骤，设置完，运行即可 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210314211553.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210314211633.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210314211711.png)

