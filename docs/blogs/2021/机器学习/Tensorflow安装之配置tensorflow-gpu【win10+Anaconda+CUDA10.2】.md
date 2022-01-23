---
title: Tensorflow安装之配置tensorflow-gpu【win10+Anaconda+CUDA10.2】
date: 2020-10-22
permalink: /machine-learning-tensorflow-win10-gpu-conda-cuda.html
tags:
 - 机器学习
 - Tensorflow
 - GPU
 - CUDA 
categories:
 - 机器学习
---

## 前言

CUDA环境的配置参考此篇博文
[Win10安装GPU版本Pytorch的全面教程【避坑指南】](https://guangmujun.cn/archives/331)
还有配置CUDA环境的小伙伴， **建议使用CUDA10.1吧** ，对tensorflow和pytorch的兼容都比较好

## 配置tf

  1. 配置好CUDA环境

  2. 新建一个虚拟环境并激活 
        
        conda create --name tf python=3.7

    conda activate tf


  3. 安装tensorflow-gpu 
        
        `pip install tensorflow-gpu`


## 测试

  1. 先测试tf是否安装成功 
        
        `import tensorflow as tf`


我使用的是CUDA10.2，这里就出现问题了：


        W tensorflow/stream_executor/platform/default/dso_loader.cc:59] Could not load dynamic library 'cudart64_101.dll'; dlerror: cudart64_101.dll not found
    
    I tensorflow/stream_executor/cuda/cudart_stub.cc:29] Ignore above cudart dlerror if you do not have a GPU set up on your machine.


比较简单的办法，是到这个[网站](https://cn.dll-
files.com/cudart64_101.dll.html)下载`cudart64_101.dll`文件，然后粘贴到CUDA10.2的bin目录下`C:\Program
Files\NVIDIA GPU Computing Toolkit\CUDA\v10.2\bin` 再次输入上述测试语句，得到如下结果，成功！


        I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library cudart64_101.dll


  2. 测试tf-gpu是否安装成功 
        
        `tf.test.gpu_device_name()`


终端输入上述指令，最后一行显示如下，即我电脑显卡的名称，成功！


        StreamExecutor device (0): GeForce GTX 1660 SUPER, Compute Capability 7.5

