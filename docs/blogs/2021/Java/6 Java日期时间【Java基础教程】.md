---
title: Java学习之Java日期时间
date: 2020-11-25
permalink: /java-learning-datetime.html
tags:
 - Java
categories:
 - Java
---

## 时间工具Date

## 日历工具Calendar

## 本地日期时间类型

无论是Date还是迟Calendar，在解决复杂问题时的编码都很别扭，故在Java8时推出了全新的本地日期时间类型。

  1. LocalDate：本地日期类型
  2. LocalTime：本地时间类型
  3. LocalDateTime：本地日期时间类型

获取本地当前时间：


​    
    private static void showLocalDateTime(){
        LocalDateTime datetime = LocalDateTime.now();
        System.out.println(datetime.toString());
    }


对于日期时间的操作，包括：

  * 获取年月日时分秒
  * 创建指定日期时间的本地实例，以及时间增减操作等
  * 日期时间的早晚关系判断
  * 本地日期时间与字符串的互相转换

