---
title: GitHub初次使用学习
date: 2019-08-14
permalink: /tool-use-github-first-useage.html
tags:
 - 工具
 - GitHub
categories:
 - 工具
---



**第一次使用GitHub**

  1. 官网注册账号
  2. Git for Windows软件下载，使用命令行操作

**GitHub** 开源社交平台 企业项目管理平台 **专有名词** repositoty 项目仓库 fork 复制别人的代码库
**GitHub的作用**

  1. 团队协作写一个文档
  2. 搭建个人博客、网站
  3. 协作翻译
  4. 项目管理
  5. 优质资源

**主要功能：版本控制**

  1. 本地版本控制
  2. 与GitHub关联 
        1. GitHub新建repository
            2. GitHub上复制远程仓库的SSH地址
                3. 本地输入`git remote add origin 复制的SSH地址`
                    4. 本地仓库与GitHub仓库并联`git push -u origin master`

**日常的操作**


​    
    git add -A
    git commit -m "提交的信息提示"
    git push


​    
​    
    git pull       在本地版本低于远程仓库版本的时候，获取远程仓库的commit


> 参考：http://www.cnblogs.com/schaepher/p/5561193.html

**团队合作开发**

> 参考：http://www.cnblogs.com/schaepher/p/4933873.html

