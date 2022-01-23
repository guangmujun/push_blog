---
title: MySQL学习之MySQL高级处理
date: 2020-12-24
permalink: /mysql-learning-senior-calculate.html
tags:
 - MySQL 
categories:
 - MySQL
---

## 窗口函数概念

  1. 窗口函数也称为OLAP函数，online analytical processing，对数据库数据进行实时分析处理。

  2. 常规的SELECT都是对整张表进行查询，而窗口函数让我们有选择的去某一部分数据进行汇总、计算和排序。

  3. 实例 
        
        SELECT product_name, product_type, sale_price,
        RANK() OVER (PARTITION BY product_type
                       ORDER BY sale_price) AS ranking


  4. 实例结果 ![ch0501](http://datawhale.club/uploads/default/optimized/1X/cdd92aff39de15d0ab7fff9cbdd7fe86bfd2d85e_2_690x273.png)

  5. 实例结果说明 

    * PARTITION BY：按照商品种类进行分组，一个商品种类就是一个小的窗口
    * ORDER BY：在每一个种类中进行排序

## 窗口函数种类

### 专用窗口函数

  1. RANK函数 计算排序，存在相同位次的记录时，则会跳过之前的位次

  2. DENSE_RANK函数 计算排序，存在相同位次的记录时，不会跳过之前的位次

  3. ROW_NUMBER函数 计算排序，赋予唯一的位次

  4. 实例 ![ch0503](http://datawhale.club/uploads/default/original/1X/807a4a60172e617d24e39a62b59de7a7693f6950.png)

### 聚合函数在窗口函数上的应用

  1. 实例 
        
        SELECT product_id,product_name, sale_price,

    SUM(sale_price) OVER (ORDER BY product_id) AS current_sum,
    AVG(sale_price) OVER (ORDER BY product_id) AS current_avg,
    FROM product;


​    

  2. 实例结果 计算的是累积到当前行的多有的数据的聚合 ![wpH8v3sNIdtgdHGD](http://datawhale.club/uploads/default/optimized/1X/c857f00b1a380dadef9e44a95f17ea9c5eab1d77_2_690x269.png) [![dWSYUjbCNhTZrFhy](http://datawhale.club/uploads/default/optimized/1X/d7ba5cb4b9522d1b2c0062dd8b4d3e17c6b2c96e_2_690x272.png)](http://datawhale.club/uploads/default/original/1X/d7ba5cb4b9522d1b2c0062dd8b4d3e17c6b2c96e.png)

## 窗口函数应用

计算移动平均

  1. 实例 
        
        SELECT product_id, product_name, sale_price,

    AVG(sale_price) OVER (ORDER BY product_id
                            ROWS 2 PRECEDING) AS moving_avg,
       AVG(sale_price) OVER (ORDER BY product_id
                            ROWS BETWEEN 1 PRECEDING
                            AND 1 FOLLOWING) AS moving_avg
    FROM product


  2. 结果 ROWS 2 PRECEDING：将框架（窗口）指定为“前n行+自身行” ![eGGd2Je3pieslAVk](http://datawhale.club/uploads/default/optimized/1X/e9b7c8a740b9de6a49dbb53c058e521e108af125_2_690x247.png) ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING：将框架指定为“前n行+自身+后n行” ![K1bOj3XhGTQe4tBx](http://datawhale.club/uploads/default/optimized/1X/c49518669b1f29f2771fa61c32954c9d53e64beb_2_690x242.png)

  3. 注意事项 

    * 只能在SELECT中使用
    * 其中的ORDER BY子句不影响最终结果的排序

## ROLLUP运算符

得到分类的合计

  1. 实例 
        
        SELECT product_type, regist_date,

    SUM(sale_price) AS sum_price
    FROM product
    GROUP BY product_type, regist_date WITH ROLLUP


  2. 结果 

![WNKuoQVZwiB56i19](http://datawhale.club/uploads/default/original/1X/c897a5b33abff6f803a06d229bc1bd865e31ed7b.png)

