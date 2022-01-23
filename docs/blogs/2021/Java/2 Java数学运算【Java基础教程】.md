---
title: Java学习之Java数学运算
date: 2020-11-19
permalink: /java-learning-math-calculate.html
tags:
 - Java
categories:
 - Java
---

## 数值变量

  1. 变量类型 
        1. byte：1字节，8位二进制数
            2. short：2字节
                3. int：4字节，常用，可表达数范围$(-2^{31},2^{31}-1)$
                    4. long：8字节，常用
                        5. float：4字节，常用
                            6. double：8字节，常用
  2. 特殊数字表达 
        1. 二进制：0b或者0B开头
            2. 八进制：以0开头，后接数字
                3. 十六进制：以0x或者0X开头
  3. 注意点 
        1. Java中整数默认是int，浮点数默认是double，如像下述这样写会出错 
       
                long worldPopulation = 7444443881;
        float huilv = 3.14;
       

        2. 解决办法，加L表示为long类型分配空间，加F表示为float类型分配空间 
            
                long worldPopulation = 7444443881L;
        float huilv = 3.14F;
       
  4. 分隔符和科学计数法 
        
        int chiaArea = 960_0000

    double sunDistance = 1.5E8


  5. 强制类型转换 把long赋值给int，会缺失高位的4个字节的信息，其他类似 
        
        long changjiang = 6397

    int longRiver = int(changjiang)


## 算数运算

  1. 四则运算

  * 取余运算：%，得到两数相除之余数
  * 除数和被除数都是int，则商是int
  * 除数和被除数之一是小数，则商是小数

  2. 一元运算符

  * x++, x-- 不存在自乘与自除

  * ++x表示先加后赋值，x++表示先赋值后加 
    
         int x = 7
     int z1 = x++  //此时z1=7
     int y = 7
     int z2 = ++y  //此时z2=8


## 数学函数

  1. 取整 round, floor, ceil, abs

  2. 取随机数 random(), Random().nextInt(), Random().nextLong()

  3. 科学计算函数 sqrt, pow, exp, log, log10

  4. 三角函数 

sin , cos, tan

