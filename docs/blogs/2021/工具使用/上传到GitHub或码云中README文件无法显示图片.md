---
title: 上传到GitHub或码云中README文件无法显示图片
date: 2019-08-14
permalink: /tool-use-github-gitee-readme.html
tags:
 - 工具
 - GitHub
 - Gitee
categories:
 - 工具

---



  1. MarkDown语法 插入图片的语法如下：`![alt text](E://data./pic.jp)`类似这样，`[]`中输入文本，当图片显示不出时显示此文本信息，`()`中输入存放图片的路径。

  2. 无法显示原因 本地插入图片时，图片的路径为本地的路径，如为`E://data.pic.jpg`或者`./data/pic.ipg`等，当README文件上传到网络中，无法读取如上述所示的路径。

  3. 解决方法 将图片的本地路径修改为网络路径， 以上传到码云为例，GitHub同理。 我的项目名称为LittleJobs，图片名为1542447445608.png，存放在项目目录下的00_OpenCV/data/results文件夹目录下。 则图片的网络路径为：https://gitee.com/guangmujun/LittleJobs/raw/master/00_OpenCV/data/results/1542447445608.png 注意其中多加入的的`raw/master/`

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181117194500517.png?x-oss-
process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3MDU0MzU2,size_16,color_FFFFFF,t_70)
或者，直接点开你已经上传的图片文件，点击原始数据 ![在这里插入图片描述](https://img-
blog.csdnimg.cn/20181117200043315.png?x-oss-
process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3MDU0MzU2,size_16,color_FFFFFF,t_70)
新跳转出的网页的链接，即为图片的网络路径，如图
https://gitee.com/guangmujun/LittleJobs/raw/master/00_OpenCV/data/results/1542447445608.png
此处链接在浏览器中打开，便可以直接看到的上传的图片 ![在这里插入图片描述](https://img-
blog.csdnimg.cn/20181117200201123.png)

