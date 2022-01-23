---
title: Tensorflow问题之No module named 'tensorflow.core'
date: 2020-10-22
permalink: /machine-learning-tensorflow-core.html
tags:
 - 机器学习
 - Tensorflow
categories:
 - 机器学习

---



## 问题

一开始的代码是这样写的，我用的是tf2


​    
    from tensorflow_core.python.keras.callbacks import LearningRateScheduler


运行后，提示出错：


​    
    MoudleNotFoundError: No module named 'tensorflow.core'


## 解决

应该是tf版本的问题，引入的位置不对，改写成下面这样：


​    
    from tensorflow.keras.callbacks import LearningRateScheduler

