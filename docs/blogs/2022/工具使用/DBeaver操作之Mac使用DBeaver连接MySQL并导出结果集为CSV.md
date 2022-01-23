---
title: DBeaver操作之Mac使用DBeaver连接MySQL并导出结果集为CSV
date: 2022-01-23
permalink: /2022/工具使用/tool-use-dbeaver-mysql-csv.html
tags:
 - 工具
 - DBeaver
 - MySQL
 - CSV
categories:
 - 工具
---



## 分析

打开DBeaver建立MySQL后，会提示下载驱动，但是由于网络原因，下载会失败

这时候就需要手动下载驱动再添加到DBeaver中

## 步骤

1、 下载提示需要下载的驱动`mysql-connector-java-8.0.17.jar`

2、DBeaver配置

- 连接设置 -> 编辑驱动设置 -> 库 -> 添加文件 -> 确定

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/202201232219642.png" style="zoom:50%;" />

## 导出结果集为CSV

查询结果空白处右击，选择【导出结果集】，再选择【CSV】格式，一直点。