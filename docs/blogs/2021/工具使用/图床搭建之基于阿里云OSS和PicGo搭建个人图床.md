---
title: 图床搭建：基于阿里云OSS和PicGo搭建个人图床
date: 2020-07-17
permalink: /picture-bed-aliyun-oss-picgo.html
tags:
 - 工具
 - 图床
 - 阿里云
 - PicGo
categories:
 - 工具
---

# 1 前言

## 意义

1. 有需求，写博客时，需要经常放入图片
2. 私人的图床更加稳定和安全，加载图片快
3. 避免博客中经常出现的“图片无法显示”问题

## 成本

- 阿里云OSS的40G存储空间，9元/年
- 整个过程大概花费约10分钟

## 效果

**流程：** 选定截图区域 -> 复制 -> 上传到图床 -> 粘贴链接 -> 图片显示

整个过程只需要**几秒钟**，十分方便。

## 网址

阿里云OSS：https://www.aliyun.com/product/oss/

PicGo下载：https://github.com/Molunerfinn/PicGo （官网下载速度较慢）

PicGo（windows版本）百度云下载：

链接: https://pan.baidu.com/s/1zWHHqLZQM3TcgVCINlMJCQ 提取码: nqsb

## 2.1 购买和配置阿里云OSS

1. 注册阿里云账号，选择一年的套餐，点击购买

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717093017.png" alt="img" style="zoom: 50%;" />

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717093112.png" alt="img" style="zoom:50%;" />

1. 创建Bucket，填写名称，选择区域，存储类型选“标准存储”，读写权限选择“公共读”，然后点击确定

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717094159.png" alt="img" style="zoom:50%;" />

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717094536.png" alt="img" style="zoom:50%;" />

## 2.2 安装和配置PicGO

1. 下载安装PicGo,windows下直接下载exe安装很方便
2. 打开阿里云的网站，鼠标放到自己的头像上，在出现的菜单中选择“AsscessKey管理”

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717101914.png" alt="img" style="zoom:50%;" />

1. 记录下面第一张图片中的ID和Secret，再点击到Bucket列表，下面第二张图箭头所指的域名为your-name.oss-cn-shanghai.ailiyuns.com，记住这个域名

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717102020.png" alt="img" style="zoom:50%;" />

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717102429.png" alt="img" style="zoom:50%;" />

1. 打开PicGo软件，在“图床设置”中选择“阿里云OSS”，如下设置参数
   - 前两栏中分别填入上述的ID和Secret，
   - 将your-name即你的BucKet名称填入PicGo软件的“设定存储空间名”
   - 将oss-cn-shanghai（我选的是上海）填入软件的“确认存储区域”
   - 指定存储路径可以自定义
   - 将箭头所指域名前加上**https://\**后，填入软件的“设定自定义域名”（！一定要加\**https://**）

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717101218.png" alt="img" style="zoom:50%;" />

## 2.3 使用搭建好的图床

关于PicGo软件的一些设置，大家可以自行摸索，设置都很简单

我自己使用的步骤如下：

- 按PrtSc键截屏，选择截屏区域
- Ctrl+C复制截图
- Ctrl+Shift+P上传截图到图床
- Ctrl+V复制图片链接到Markdown编辑器中

OK~ 搭建完成，使用起来，我个人感觉十分方便，并且图片加载的很快，之前有用过Github做图床，缺点就是图片加载很慢，所以也可以尝试用Gitee做图床，这个可能需要大家根据自己情况来选择，但是不推荐大家用免费的公用的图床。