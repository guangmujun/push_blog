---
title: WordPress中Markdown写博文的详细设置（代码高亮、自定义代码样式、目录、公式）
date: 2020-03-26
permalink: /tool-use-wordpress-markdown.html
tags:
 - 工具
 - WordPress
 - Markdown
categories:
 - 工具
---





## 前言

此段纯属瞎扯，可以直接跳过。
个人博客搭建好以后，一开始发了几篇博文，后面太懒了，好久没更新，昨日打开网站，无意间发现其中一篇博文居然多了几条评论，小心脏扑腾扑腾，哈哈哈哈哈~（没错，就是这篇[pyinstaller打包python程序的常见问题](https://guangmujun.cn/archives/168)）
点开一看，惊了，被下面这位名为“李铁牛”的网友，感动哭了😂，于是下定决心，怒搞了一波自己的博客！！！

![](https://img-blog.csdnimg.cn/20200326073250428.png)

于是乎，便从写博文的编辑器开始整改，安装支持Markdown语法的编辑器，尝试了一些，都还可以，但是问题来了~
显示出来的代码样式，我天，是这样的，一层套一层的，做成一名优雅的程序猿，表示想砸键盘……

![](https://img-blog.csdnimg.cn/20200326073936790.png)

怎么办呢？使用wordpress遇到这样的问题，解决的整体思路是啥呢？ **不要到处瞎搜乱搞的**
，找到一款插件后，仔细来把这个插件的每一个功能仔细研究下，看其提供的官方文档，很多插件的功能是很丰富很强大的。 好了，下面小编要认真起来了 ~~~~

## 自定义代码样式

  1. 安装插件 WP Editor.md

这时候你就可以用Markdown语法写博文了，比如插入一段python的代码，打开预览一看，还是上图想要让人想砸键盘的效果，下面是插入的代码，不是预览的效果~


​    
        ```python
        import pandas as pd
        import numpy as np
    
        # 载入测试集和训练集
        Train_data = pd.read_csv('used_car_train_20200313.csv', sep=' ')
        Test_data = pd.read_csv('used_car_testA_20200313.csv', sep=' ')
    
        print('Train data shape:', Train_data.shape)
        print('TestA data shape:', Test_data.shape)
        ```


  3. 进行插件的语法高亮设置

在下图这里，可以把前四个选项都勾上，意思很好懂。 关键的地方来了，在“ **语法高亮主题风格** ”的下拉框中，选择“ **自定义风格** ”，然后在“
**自定义风格样式地址** ”中输入网站，那个这个网址怎么来呢？

![](https://img-blog.csdnimg.cn/20200326075144798.png)

点击上图的超链接“ **主题风格** ”，在跳出的网站上选择一个主题样式下载，右击“ **Row**
”按钮，然后点击下载就可以，下载下来的是一个css文件，小编这里下载的是第一个样式CB。

![](https://img-blog.csdnimg.cn/20200326075756905.png)

将这个css文件，放到你的服务器上，然后把对应的地址粘贴到上述提到的地址栏中，点击“ **保存更改** ”，就OK了。 效果图：

![](https://img-blog.csdnimg.cn/202003260801225.png)

## 语法高亮

哦豁，这个在前面已经顺便讲了哈，需要注意的是，在插入代码段的时候，记得写上所使用编程语言的名称，比如插入python代码，语法中的“python”就不能省略，否则没法高亮。

## 设置目录

WP Editor.md具备这个功能，但是需要再安装下TOC+这个插件，如下图，选项勾上，点击超链接，下载安装即可，很方便。

![](https://img-blog.csdnimg.cn/20200326080620340.png)

安装完成后，简单设置下，关键是这里，选择“post”，意思是在博文中插入目录，其他的设置很简单，按照自己的需求勾选以下就可了。

![](https://img-blog.csdnimg.cn/2020032608072861.png)

效果如下，如果能够始终悬浮在右侧就更好了，但是还没去搜索下怎么做，有小伙伴知道的话，可以给留个链接哈，感激不尽，哈哈哈哈~

![](https://img-blog.csdnimg.cn/20200326080847111.png)

## 设置公式

超级简单，选择KaTex，就可以正常显示Markdown语法写的公式了~

![](https://img-blog.csdnimg.cn/20200326081009447.png)

OK，感谢铁牛网友的激励，才有了现在这篇的博客，真是个感人的小故事，哈哈哈哈哈~

