---
title: Java学习之Java开发环境搭建
date: 2020-11-18
permalink: /java-learning-create-java-env.html
tags:
 - Java
 - 环境搭建
categories:
 - Java
---



## 安装JDK

## IntelliJ IDEA

## Java虚拟机

  1. Java程序的运行机制 
        1. Java程序能够跨平台运行，一次编译，到处运行
            2. 将写好的`.java`文件编译成`.class`文件后，`.class`文件便可以在windows或者linux上运行
                3. 主要是缘于Java引进了虚拟机的概念
                    4. 虚拟机：模拟实际计算机的功能来接管程序对系统底层的调用
                        5. 所以程序只与虚拟机交互，不用管与系统底层的交互
  2. JVM、JRE与JDK的区别 
        1. JVM：Java Virtual Machine
            2. JRE：Java Runtime Environment
                3. JDK：Java Development Kit
                    4. 区别 
      1. JVM：一套运行规范，如果其他编程语言遵循JVM的运行规范，那么同样能够运行于JVM
      2. JRE：是运行Java程序所必须的环境集合，包含JVM的标准实现和Java的核心类库
      3. JDK：包含JRE的所有内容，还包括编译、排错、打包等实用小工具

## Java编程基本概念

**代码结构**

  1. 工作空间 -- 星球
  2. 项目 -- 国家
  3. 包 -- 国家的行政区划 
        1. 最顶层（com/net/org/edu） -- 国体
            2. xxx郡xxx县
  4. 类 -- 城池
  5. main -- 进入的城门
  6. 其他方法 -- 其他城门
  7. 分号结束一行，一行内分隔用逗号
  8. 字符串需要用双引号包裹

**基础规则**

  1. 注释，`\\`表示单行注释，`\*`表示多行注释

  2. 输出 
        
        System.out.println('Hello World!')


    1. `System`：进行系统操作
    2. `out`：向控制台输出信息
    3. `println`：打印括号内的文本， **并跳到下一行** ，ln是line的缩写
  3. 输入 
        
        package com.world.hello;

    import java.util.Scanner;    // 导入系统自带的Scanner工具
    
    public class Hello {
       public static void main(String[] args) {
           System.out.print("输入一个数字：");
           Scanner scan = new Scanner(System.in);
           /*通过扫描器的`nextLine`方法获得一行文字*/
           System.out.println("输入的数字是："+scan.nextLine());
       }
    }


  4. 类的属性 
        1. public修饰的城池都是对外开放的城市
            2. public修饰的东西都是允许出口的货物
    
        package com.jiangsu.test;

    import com.world.hello.Hello;
    
    public class test {
       public static void main(String[] args) {
           System.out.println("这里是test");
           Hello.getHello();
       }
    }


​    
        这里是test
    这里是Hello


**命名规范**

  1. 工作空间：字母开头
  2. 项目名称：大写字母开头
  3. 包名称：小写字母
  4. 类名称：字母数字组成，大写字母开头
  5. 方法的名称：小写字母开头
  6. 变量名称：小写字母开头
  7. 常量名称：全为大写字母

