---
title: 基于Hugo和Github搭建个人博客
date: 2020-07-07
permalink: /make-blog-by-hugo-and-github.html
tags:
 - 工具
 - 博客搭建
 - Hugo
 - GitHub
categories:
 - 工具
---

## 1 下载和安装hugo

### 环境

windows 64位

### 下载地址

hugo官网：https://gohugo.io/

hugo（win x64）百度云：

https://pan.baidu.com/s/1WUdTeGw_3M9MK90MA4nkJg

提取码：567t

### 安装过程

1. 将压缩包中的exe文件解压出来
2. 将exe文件所在目录添加到环境变量
3. 终端中输入：`hugo version`，测试hugo是否安装成功

## 2 新建一个网站

新建一个项目文件夹，在命令终端中输入如下命令，运行完成后，便会在目录下出现许多文件夹

```python
hugo new site your-wbesite-name
```

## 3 下载和配置hugo主题

### 主题下载

将主题下载到`themes`文件夹下

官网：https://themes.gohugo.io/

我自己使用的主题：https://github.com/liuzc/LeaveIt

### 主题配置

1. 参考主题中的`theme.toml`配置文件，对主目录下的`config.toml`进行配置
2. 使用主题中的`archetypes`文件夹下的`default.md`，替换主目录下相同文件夹下的同名文件
3. 打开替换后的`default.md`文件，删除`draft`参数所在行，不然文章内容无法显示出来

## 4 本地使用hugo

### 启动hugo

终端中输入`hugo server`，点击终端显示出的http://localhost:1313/ ，访问网站，便能看到主题对应的效果

### 新建博文

终端中输入`hugo new posts/blog.md`，便会在主目录下的`content/posts`文件夹生成Markdown文件，打开撰写博文内容，完成后保存即可

### 生成静态网页

进入主目录下的`public`文件夹，此处打开终端，输入命令`hugo`，即可在此目录下生成相关文件

## 5 部署到Github

1. Github新建仓库，仓库名为**username.github.io**，注意名称一定写正确，用户名全用小写字母

2. 将`public`目录下所有文件上传到仓库中

   初次上传到仓库用到的命令：

   ```python
   git init
   git add .
   git commit -m "first commit"
   git remote add origin https://github.com/username/username.github.io  # 使用自己的用户名
   git push -u origin master  # 然后输入自己的用户名和密码
   git push
   ```

   以后上传使用的命令：

   ```python
   git add .
   git commit -m "commit info"
   git push
   ```

3. 访问https://username.github.io，博文可正常打开，搭建成功，效果图

![img](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717115453.png)