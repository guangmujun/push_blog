---
title: Python问题之用pip安装GDAL时出错
date: 2019-08-14
permalink: /python-problem-error-in-pip-install-gdal.html
tags:
 - Python
 - Pip
 - GDAL
categories:
 - Python
---

**原因** ：GDAL不是纯净的python库，无法像`pip install flask`这样安装库文件。 

**解决方法** ：

  1. 查看安装信息 命令行中输入 python ，回车后即可查看已安装系统的位数和Python的版本 如图，我的是64位系统，python3.6 ![](https://img-blog.csdnimg.cn/20181029163049668.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3MDU0MzU2,size_27,color_FFFFFF,t_70)
  2. 下载GDAL安装文件 下载网址： https://www.lfd.uci.edu/~gohlke/pythonlibs/#gdal 根据步骤1中的系统和python版本信息，下载对应的文件。![在这里插入图片描述](https://img-blog.csdnimg.cn/20181029163402427.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3MDU0MzU2,size_27,color_FFFFFF,t_70)
  3. 安装GDAL 将下载的.whl文件复制到项目文件下 在终端进入到对应的项目文件夹目录下，用pip安装刚刚下载的.whl文件 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20181029163632181.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3MDU0MzU2,size_27,color_FFFFFF,t_70)
  4. 结果检验 在终端输入 pip list ，查看是否成功安装GDAL ![在这里插入图片描述](https://img-blog.csdnimg.cn/20181029164238139.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3MDU0MzU2,size_27,color_FFFFFF,t_70)

