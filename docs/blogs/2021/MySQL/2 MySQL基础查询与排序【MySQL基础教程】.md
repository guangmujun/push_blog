---
title: MySQL学习之MySQL基础查询与排序
date: 2020-12-16
permalink: /mysql-learning-select-sort.html
tags:
 - MySQL 
categories:
 - MySQL
---



## SELECT语句

### 从表中选数据


​    
    SELECT *
    FROM product_table;


### 从表中选符合条件的数据


​    
    SELECT *
    FROM product_table
    WHERE product_type = 'Tool';


​    
​    
    SELECT DISTINCT product_type AS type,  -- 删除重复数据
           product_id AS id,
           purchase_price AS "进货单价"
    FROM product;


## 运算符

### 算数运算符

`+ - * /`

### 比较运算符

`<>`表示和不相等 对于`NULL`只能用`IS NULL`或者`IS NOT NULL`来判断

### 逻辑运算符

`NOT AND OR`优先级依次降低 SQL中的逻辑运算是三值运算`TRUE FALSE UNKNOWN`

## 练习题

**2.1**
编写一条SQL语句，从product（商品）表中选取出“登记日期（regist在2009年4月28日之后”的商品，查询结果要包含product
name和regist_date两列。


​    
    SELECT product_name, regist_date
    FROM product
    WHERE regist > '2009-4-28';


**2.2** 请说出对product 表执行如下3条SELECT语句时的返回结果。 **结果都是空** ①


​    
    SELECT *
      FROM product
     WHERE purchase_price = NULL;


②


​    
    SELECT *
      FROM product
     WHERE purchase_price <> NULL;


③


​    
    SELECT *
      FROM product
     WHERE product_name > NULL;


**2.3** 代码清单2-22（2-2节）中的SELECT语句能够从product表中取出“销售单价（saleprice）比进货单价（purchase
price）高出500日元以上”的商品。请写出两条可以得到相同结果的SELECT语句。执行结果如下所示。


​    
    product_name | sale_price | purchase_price 
    -------------+------------+------------
    T恤衫         |   1000    | 500
    运动T恤       |    4000    | 2800
    高压锅        |    6800    | 5000


​    
​    
    SELECT product_name, sale_price, purchase_price
    FROM product
    WHERE purchase_price - sale_price < 500;


**2.4**
请写出一条SELECT语句，从product表中选取出满足“销售单价打九折之后利润高于100日元的办公用品和厨房用具”条件的记录。查询结果要包括product_name列、product_type列以及销售单价打九折之后的利润（别名设定为profit）。
提示：销售单价打九折，可以通过saleprice列的值乘以0.9获得，利润可以通过该值减去purchase_price列的值获得。


​    
    SELECT product_name, 
           product_type, 
           sale_price * 0.9 - purchase_price AS profit
    FROM product
    WHERE sale_price * 0.9 - purchase_price > 100;


## 聚合查询

### 聚合函数

`COUNT SUM AVG MAX MIN`


​    
    -- 计算包含NULL的全部数据的行数
    SELECT COUNT(*)
    FROM product_table;
    -- 计算NULL以外的数据的行数
    SELECT COUNT(purchase_price)
    FROM product_table;
    -- 计算去除重复数据后的数据行数
    SELECT COUNT (DISTINCT product_type)
    FROM product_table;


## 分组查询

### GROUP BY


​    
    -- 按照商品种类统计数据行数
    SELECT product_type, COUNT(*)
      FROM product
     GROUP BY product_type;


​    
​    
    SELECT purchase_price, COUNT(*)
      FROM product
     WHERE product_type = '衣服'    -- WHERE语句必须在GROUP BY语句前面
     GROUP BY purchase_price;


### HAVING

得到分组后的特定分组


​    
    SELECT product_type, COUNT(*)
      FROM product
     GROUP BY product_type
    HAVING COUNT(*) = 2;


## 结果排序

### ORDER BY

默认是升序，DESC为降序


​    
    SELECT product_id, product_name, sale_price, purchase_price
      FROM product
     ORDER BY sale_price, product_id;


当出现以下语句顺序时，ORDER BY语句中可以使用SELECT中定义的别名： `SELECT -> FROM -> WHERE -> GROUP BY
-> HAVING -> SELECT -> ORDER BY`

## 练习题

**2.5** 请指出下述SELECT语句中所有的语法错误。


​    
    SELECT product id，SUM（product name）
    --本SELECT语句中存在错误。
      FROM product 
     GROUP BY product_type 
     WHERE regist_date > '2009-09-01'；


WHERE语句放在了GROUP BY语句的后面；product_type不是聚合键。 **2.6**
请编写一条SELECT语句，求出销售单价（sale_price列）合计值是进货单价（purchase
prilce列）合计值1.5倍的商品种类。执行结果如下所示。


​    
    product_type | sum  | sum 
    -------------+------+------
    衣服         | 5000 | 3300
    办公用品      |  600 | 320


![nWcaoYoY6NkcdR3A](http://datawhale.club/uploads/default/original/1X/82383bfaa2d969011e538a7418ffb26a73584d92.png)


​    
    SELECT product_type, SUM(sale_price), SUM(purchase_price)
    FROM product
    ORDER BY product_type;
    HAVING SUM(sale_price) = SUM(purchase_price) * 1.5


**2.7**
此前我们曾经使用SELECT语句选取出了product（商品）表中的全部记录。当时我们使用了ORDERBY子句来指定排列顺序，但现在已经无法记起当时如何指定的了。请根据下列执行结果，思考ORDERBY子句的内容。
![Ig0bhBIB1Di4BCTV](http://datawhale.club/uploads/default/optimized/1X/dd460a4793016d2d3ae6d5c4930314a9eb0bbcf7_2_690x256.png)


​    
    SELECT *
    FROM product_table
    ORDER BY regist_date DESC;


## 补充

### NULL和空值

  1. NULL就是在字段中存储`NULL`
  2. 空值就是在字段中存储 `‘’`

## 参考

> http://datawhale.club/t/topic/476

