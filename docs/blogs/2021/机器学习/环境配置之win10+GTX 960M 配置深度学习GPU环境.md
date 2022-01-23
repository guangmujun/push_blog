---
title: 环境配置之win10+GTX 960M 配置深度学习GPU环境
date: 2020-05-05
permalink: /machine-learning-win10-gtx960m-deep-learning-gpu-env.html
tags:
 - 机器学习
 - GPU
 - 深度学习 
categories:
 - 机器学习
---

## 卸载与安装

> 参考： https://blog.csdn.net/shuiyuejihua/article/details/78738664

## 安装详细过程

> 参考1：https://blog.csdn.net/weixin_44633882/article/details/86771631 参考2:
> https://zhuanlan.zhihu.com/p/37086409

**建议步骤：** 

1\. 用默认的方式成功安装cuda

 2\. 下载和使用cudnn，官网下载需要注册，文末放了百度云的链接供下载

 3\. 添加环境变量
4\. 在Anaconda中创建虚拟环境，指定python版本，并输入安装命令`pip install --ignore-installed
--upgrade tensorflow_gpu==1.8.0` 

5\. 编写脚本测试是否安装成功 

6\. 配置相关的环境，比如`jupyternotebook`， 参考[这篇博文](https://guangmujun.cn/archives/302)

## 资源下载

CUDA： 链接：https://pan.baidu.com/s/1_4cE6mYoQovK0cLybda-zg 提取码：by4x CUDNN:
链接：https://pan.baidu.com/s/17L2JNKlx-nCrAeSiX0ILPQ 提取码：3dc4

