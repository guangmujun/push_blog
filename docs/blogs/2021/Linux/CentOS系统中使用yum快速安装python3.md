---
title: CentOS系统中使用yum快速安装python3
date: 2019-08-24
permalink: /linux-centos-yum-install-python.html
tags:
 - Linux
 - Python
 - CentOS 
categories:
 - Linux

---



## 需求

购买CentOS系统的云服务器后，发现系统内置的python版本为python2,
而且目前多数Linux系统的云服务器中都内置的是python2，但是python2即将停止维护，
又因为程序都是用python3写的，故有了在CentOS系统中安装python3的需求

## 查阅资料

一查在Linux系统中安装python3，很多都是源码安装，对我这样小白来说，看看了教程便直接放弃了……
后来无意间看到使用yum可以简单快速的安装python3，但是教程中仍然会有一些坑 所以写下这边篇简单的快速安装教程，当然通过源码安装能更好的了解其原理

## 安装教程

  1. 安装epel


​    
    yum install epel-release


  2. 安装对应系统版本的ius【这一步自动找到与你的CentOS系统适配的ius】


​    
    yum install https://$(rpm -E '%{?centos:centos}%{!?centos:rhel}%{rhel}').iuscommunity.org/ius-release.rpm


  3. 安装python3和pip


​    
    yum install python36u
    
    yum install python36u-pip


  4. 查询软件安装位置，创建软链接【需根据查询到的软件安装路径，如查询到python3.6安装的路径后，修改`ln -s ******* /bin/python3`中的`********`为此路径，pip的修改同理】


​    
    whereis python3.6   
    
    ln -s /usr/bin/python3.6 /bin/python3
    
    yum list installed | grep pip3.6    
    
    ln -s /usr/bin/pip3.6 /bin/pip3


## 验证安装

安装好后，在命令终端分别输入`python3`和`pip3`，如果出现对应的版本信息，则安装成功，否则安装失败。

