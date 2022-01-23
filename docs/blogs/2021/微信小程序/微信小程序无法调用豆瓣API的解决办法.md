---
title: 微信小程序无法调用豆瓣API的解决办法
date: 2019-08-14
permalink: /wechat-little-program-douban-api.html
tags:
 - 微信小程序
 - 豆瓣
categories:
 - 微信小程序

---


小程序无法调用豆瓣API的解决办法 **情况描述：** https://api.douban.com/v2/book/isbn/9787506365437
浏览器可正常访问上述URL，而在小程序中向此URL发送请求时，却出现403错误，如图， ![在这里插入图片描述](https://img-blog.csdnimg.cn/20181105165540170.png?x-oss-
process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3MDU0MzU2,size_16,color_FFFFFF,t_70)
**原因：** 豆瓣官方不允许小程序代用其API **解决方案：** 一位大神搭建了豆瓣API的反向代理
将上述链接中的`api.douban.com`替换成`douban.uieee.com`即可 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20181105165552538.png?x-oss-
process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3MDU0MzU2,size_16,color_FFFFFF,t_70)
**说明：** 上述链接为豆瓣 **图书** API：https://api.douban.com/v2/book/isbn/9787506365437
将“9787506365437”替换成对应书籍的ISBN号，即可查询出此书籍的相关信息

