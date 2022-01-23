---
title: 快速使用GitBook以及二级标题的设置
date: 2019-08-14
permalink: /tool-use-gitbook-second-title-setting.html
tags:
 - 工具
 - GitBook
categories:
 - 工具

---




## 安装

  1. `node -v` 查看是否安装node.js , 命令行输入上述命令，出现版本号则已安装，否则无

  2. `https://nodejs.org/en/` 安装node.js，从官网下载安装

  3. `npm install gitbook-cli -g` 安装GitBook， 命令行输入上述命令

  4. `gitbook -V` 查看是否安装成功，命令行输入上述命令，出现版本号则已安装，否则无

## 基本用法

  1. `gitbook init`

  2. `gitbook serve` 运行出错时，关闭杀毒软件后再重新运行

  3. `http://localhost:4000`

## 二级标题

![1562673657738](https://raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1562673657738.png)
效果如图 一级标题可以点击显示内容 二级标题同样可以点击显示内容 灰色的一级标题作为分割，不可点击 **实现方法：**

  1. 先在目录下新建part1和part2文件夹，part1用于存放“Python学习”，part2存放"ML" ![1562673921167](https://raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1562673921167.png)
  2. 修改SUMMARY.md内容 ![1562674023664](https://raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1562674023664.png)

![1562674068128](https://raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1562674068128.png)

  3. 在part1文件夹下创建README.md和pyinstaller.md文件，其中： 点击“Python学习”则展示README.md中所写内容 点击“Pyinstaller打包程序”则展示pyinstaller.md中的内容 ![1562674142161](https://raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1562674142161.png)
  4. 在SUMMARY.md中正常加入标题，就可实现用于分割的灰色标题 ![1562674298922](https://raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1562674298922.png)

## 问题

修改文件夹路径后，浏览器打开后报错


​    
    ENOENT: no such file or directory, stat 'E:\GitHub\mybooks\tech_book\_book\part1\index.html'


解决方法： 重新编译后再运行


​    
    gitbook build
    gitbook serve


## 视频教程

[GitBook快速使用教程](https://www.bilibili.com/video/av58871992)
[GitBook二级标题设置教程](https://www.bilibili.com/video/av58873387)

