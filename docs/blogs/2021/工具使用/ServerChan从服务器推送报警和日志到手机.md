---
title: ServerChan从服务器推送报警和日志到手机
date: 2021-01-29
permalink: /tool-use-ServerChan.html
tags:
 - 工具
 - ServerChan
categories:
 - 工具
---

## 简介

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210121092358.png)
![scgif.gif](http://anime-cache.stor.sinaapp.com/59bdc111f5d7df399b5f86a20163dfa0.gif)

## 使用

  1. 打开网址：http://sc.ftqq.com/?c=code

  2. 使用Github账号登入

  3. 点击【微信推送】，开始绑定微信，扫码，关注，网页上点击检查结果并确认绑定 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210121092753.png)

  4. 点击【发送消息】，输入内容后点击发送消息按钮，提示发送成功 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210121093239.png)

  5. 微信端的方糖公众号收到消息 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210121093404.png) ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210121093426.png)

  6. 一行代码把消息推送到ServerChan 
        
        file_get_contents('http://sc.ftqq.com/SCKEY.send?text='.urlencode('主人第250号简历分析失败啦~'));


## 补充

  1. 发送的消息支持Markdown，推送页面采用 [Parsedown](https://github.com/erusev/parsedown) 1.7.3 进行渲染，[语法可以参考这里](https://github.github.com/gfm/) 。在 Markdown 语法中，两个空行才是换行，不能换行的同学多加个回车应该就好啦。
  2. 有发送时间和发送内容的限制

