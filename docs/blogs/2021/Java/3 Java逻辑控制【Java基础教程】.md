---
title: Java学习之Java逻辑控制
date: 2020-11-24
permalink: /java-learning-logit-control.html
tags:
 - Java
categories:
 - Java
---



## 逻辑运算

  1. 布尔类型及其运算 
        1. 与 &， 或 |，非 !， 异或 ^ （相异为真）
            2. 简化赋值操作： &=
  2. 关系运算符 
        1. ==， !=, >=, <=, >, <
  3. 运算符优先级

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201124170404.png)

  4. 按位逻辑与短路逻辑 
        1. 按位：与，或，异或 
       
                int a = 3 & 7;  //3和7的二进制分别为0000 0011和0000 0111，则a的结果为0000 0011 = 3 
       

        2. 短路： &&，左边的计算能够确定结果，就立即返回判断结果 
            
                int j = 1;
        boolean b = 3 > 4 && j++ <5;  //b为False
       

## 控制语句

  1. 条件分支 
        
        package com.jiangsu.nanjing;

    import java.util.Scanner;
    
    public class City {
       public static void main(String[] args) {
           System.out.println("猜谜语：");
           Scanner scan  = new Scanner(System.in);
           int seq = scan.nextInt();
           // 常规if……else语句
           if (seq == 1) {
               System.out.println("正确");
           }else if (seq == 2) {
               System.out.println("错误");
           }else {
               System.out.println("输入有误");
           }
           // 三元运算符
           int newSeq = 0;
           newSeq = seq==1?100:200;
           System.out.println("new_seq="+newSeq);
       }
    }


  2. 多路分支 
        
        package com.jiangsu.nanjing;

    import java.util.Scanner;
    
    public class City {
       public static void main(String[] args) {
           System.out.println("猜谜语：");
           Scanner scan  = new Scanner(System.in);
           int seq = scan.nextInt();
           switch (seq) {
               case 1:
                   System.out.println("right");
                   break;
               case 2:
                   System.out.println("wrong");
                   break;
               default:
                   System.out.println("error");
                   break;
           }
       }
    }


  3. while循环 
        
        public class City {
       public static void main(String[] args) {
           int year = 0;
           int limit = 3;
           while (true) {
               if (year < limit) {
                   year++;
                   continue;
               }else {
                   break;
               }
           }
       }

    }


  4. for循环 
        
        public class City {
       public static void main(String[] args) {
           int limit = 3;
           for (int year = 0; year<limit;year++) {
               System.out.println("year="+year);
           }
       }

    }

