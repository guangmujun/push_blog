---
title: Java学习之Java方法与包
date: 2020-11-24
permalink: /java-learning-function-package.html
tags:
 - Java
categories:
 - Java
---



## 方法定义

  1. 组成形式 
        1. public：可被其他代码文件访问
            2. static：静态的，可被外部直接访问
                3. void：没有返回值，int表示返回整型，double表示返回双精度数
                    4. 输入参数：String[] 表示字符串数组
  2. 输入参数 
        1. 名称相同，但是参数个数与参数类型不同的方法，通过方法重载机制区分

            2. 输入参数在变量类型后面添加“…”，表示参数是可变参数，调用时填写的参数数量可多可少

                3. 可变参数与数组参数在方法内部的处理代码基本没有区别，但在外部调用时书写的参数形式是不一样的 
       
                // 可变参数
        setAlarm(1, -10, 3);
       
        // 数组参数
        int[] addedArray= {1, -10, 3};
        setAlarm(addedArray);
       
  3. 输出参数 
        
        if (n < 0):

    System.out.println("……")；
    return;                     // return 语句表示该方法的剩余代码都不执行


## 基本类型包装

引入包装类型的目的：方便拓展应用场合

  1. 数值类型包装 
        1. 基本数值类型变量不能直接调用方法 --> Java另外为基本类型定义了对应的包装类型

            2. 包装变量赋值 
       
                Integer oneInteger = 1;
        Integer secondInteger = Integer.valueOf(2);
       

        3. 包装变量赋值给基本变量 
            
                byte oneByte = oneInteger.byteValue();  // 包装变量转换成字节变量
       
  2. 包装变量运算 
        1. 可以使用常规的四则运算

            2. 判断两个包装变量是否相等时需要通过`equals`方法来校验

                3. 常见逻辑方法 
       
                int a = 7, b = 8;
        int sum = Integer.sum(a, b);
        int max = Integer.max(a, b);
        int min = Integer.min(a, b);
        int conpareResult = Integer.compare(a, b); // 相等返回0，前者小返回-1，后者小返回1
       
  3. 布尔类型包装 
        1. 逻辑方法 
       
                boolean c = true, d = false;
        boolean andResult = Boolean.logicalAnd(c, d);
        boolean orResult = Boolean.logicalOr(c, d);
        boolean xorResult = Boolean.logicalXor(c, d);
       
  4. 大数字类型 
        1. 大整数BigInteger 
      1. 能够表示任意大小的整数

      2. 只能使用`valueOf`进行初始化 
         
                        BigInteger nine = BigInteger.valueOf(9);
      

      3. 通过专门的方法开展运算 
         
                        BigInteger sum = nine.add(four);
            BigInteger sub = nine.subtract(four);
            BigInteger mul = nine.multiply(four);
            BigInteger div = nine.divide(four);
            BigInteger remainer = nine.remainder(four);  // 取余
            

        2. 大小数BigDecimal 
      1. 和大整数类似

      2. 不能直接表示无限小数，必须是一个有限的范围，所以需要制定保留位数和保留方式参数 
         
                        BigDecimal one = BigDecimal.valueOf(100);
            BigDecimal three = BigDecimal.valueOf(3);
            // 方法一
            BigDecimal div = one.divide(three, 64, 4);
            System.out.println(div);
            
            //方法二
            MathContext mc = new MathContext(64, RoundingMode.HALF_UP); // 一处定义，多处使用
            BigDecimal divByMC = one.divide(three, mc);
            System.out.println(divByMC);
            

