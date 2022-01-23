---
title: 机器学习问题之sklearn中cross_validation包无法使用
date: 2019-08-14
permalink: /machine-problem-sklearn-cross-validation.html
tags:
 - 机器学习
 - 问题 
categories:
 - 机器学习

---


**情况描述：** 想要从sklean.cross_validation中引入train_test_split，代码运行后出现一下问题
提示不存在sklean.cross_validation模块 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20181101213755411.png) ![在这里插入图片描述](https://img-blog.csdnimg.cn/20181101213819221.png) **解决方法：**
从sklearn.model_selection引入train_test_split即可 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20181101214131742.png)

