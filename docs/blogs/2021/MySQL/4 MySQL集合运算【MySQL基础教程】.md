---
title: MySQL学习之MySQL集合运算
date: 2020-12-22
permalink: /mysql-learning-collection-calculate.html
tags:
 - MySQL 
categories:
 - MySQL
---



## 表的加减法

### UNION

  * 对多张表进行求并集运算
  * 对一张表也可以进行并集运算
  * 通常会去除重复的记录
  * 不去重的话，在UNION后面加ALL关键字
  * bag与set模型 
    * bag类型中的数据允许重复，而set类型中的元素是互异的
    * bag的并运算：1. 该元素是否至少在一个bag里出现过 2.该元素在两个bag中的最大出现次数

    
    
    SELECT product_id, product_name
    FROM product
    UNION
    SELECT product_id, product_name
    FROM product_2;
    

### INTERSECT

交运算，MySQL8.0不支持

### EXCEPT

减法运算，MySQL8.0不支持，可使用NOT IN来实现表的减法运算。


​    
    SELECT *
    FROM product 
    WHERE product_id NOT IN (SELECT product_id FROM product2)


EXCEPT ALL 按出现次数进行减法，也是使用bag模型进行运算，运算示例：

> 这两个方面来进行计算. 只有属于被减数的bag的元素才参与EXCEP ALL运算,
> 并且差bag中的次数,等于该元素在两个bag的出现次数之差(差为零或负数则不出现). 因此对于 A = {1,1,1,2,3,5,7}, B =
> {1,1,2,2,4,6,8} 两个 bag, 它们的差就等于 {1,3,5,7}.

### 对称差

两个集合的对称差等于A-B并上B-A 使用NOT IN 和 UNION实现

## 连结JOIN

### INNER JOIN


​    
    FROM <tb1> INNER JOIN <tb2> ON <condition(s)>


​    
​    
    SELECT SP.shop_id,SP.shop_name, SP.product_id, P.product_name,
            P.product_type, P.sale_price, SP.quantity
    FROM shopproduct AS SP
    INNER JOIN product AS P
    ON SP.product_id = P.product_id;


 结合WHERE子句使用内连结


​    
    SELECT *
      FROM (-- 第一步查询的结果
            SELECT SP.shop_id
                   ,SP.shop_name
                   ,SP.product_id
                   ,P.product_name
                   ,P.product_type
                   ,P.sale_price
                   ,SP.quantity
              FROM shopproduct AS SP
             INNER JOIN product AS P
                ON SP.product_id = P.product_id) AS STEP1
     WHERE shop_name = '东京'
       AND product_type = '衣服' ;


上述的标准写法： 执行顺序为：FROM -> WHERE -> SELECT


​    
    SELECT  SP.shop_id
           ,SP.shop_name
           ,SP.product_id
           ,P.product_name
           ,P.product_type
           ,P.sale_price
           ,SP.quantity
      FROM shopproduct AS SP
     INNER JOIN product AS P
        ON SP.product_id = P.product_id
     WHERE SP.shop_name = '东京'
       AND P.product_type = '衣服' ;


结合GROUP BY子句使用内连结


​    
    SELECT SP.shop_id, SP.shop_name, 
            MAX(P.sale_price) AS max_price
    FROM shopproduct AS SP
    INNER JOIN product AS P
    ON SP.product_id = P.product_id
    GROUP BY SP.shop_id, SP.shop_name


### SELF JOIN

自连结可以是外连结也可以是内连结 内连结与关联子查询找出每个商品种类当中售价高于该类商品的平均售价的商品


​    
    SELECT  P1.product_id
           ,P1.product_name
           ,P1.product_type
           ,P1.sale_price
           ,P2.avg_price
      FROM product AS P1
     INNER JOIN 
       (SELECT product_type,AVG(sale_price) AS avg_price 
          FROM product 
         GROUP BY product_type) AS P2 
        ON P1.product_type = P2.product_type
     WHERE P1.sale_price > P2.avg_price;


### NATURAL JOIN

自然连结，是内连结的一种特例，会按照两个表中都包含的列名进行等值内连结，无需使用ON来指定连结条件。


​    
    SELECT * FROM shopproduct NATURAL JOIN product


求出两张表或子查询的公共部分


​    
    SELECT * FROM product NATURAL JOIN product2


注意字段为空的情况：


​    
    SELECT *
    FROM (SELECT product_id, product_name
         FROM product) AS A
    NATURAL JOIN
        (SELECT product_id, product_name
        FROM product2) AS B;


使用连结求交集


​    
    SELECT P1.*
    FROM product AS P1
    INNER JOIN product2 AS P2
    ON P1.product_id = P2.product_id


### OUTER JOIN

外连结，根据外连结的种类有选择的保留无法匹配到的行

  * 左连结 
    * 保留左表中无法按照ON子句匹配到的行，此时对应右表的行均为缺失值
  * 右连结
  * 全外连结 
    * 同时保留两个表中无法按照ON子句匹配到的行，相应的另一张表中的行用缺失值填充

    
    
    FROM <tb1> LEFT OUTER JOIN <tb2> ON <condition(s)>
    FROM <tb1> RIGHT OUTER JOIN <tb2> ON <condition(s)>
    FROM <tb1> FULL OUTER JOIN <tb2> ON <condition(s)>
    

左连结示例：


​    
    SELECT SP.shop_id
           ,SP.shop_name
           ,SP.product_id
           ,P.product_name
           ,P.sale_price
      FROM product AS P
      LEFT OUTER JOIN shopproduct AS SP
        ON SP.product_id = P.product_id;


和WHERE结合使用：


​    
    SELECT P.product_id
          ,P.product_name
          ,P.sale_price
           ,SP.shop_id
          ,SP.shop_name
          ,SP.quantity 
      FROM product AS P
      LEFT OUTER JOIN-- 先筛选quantity<50的商品
       (SELECT *
          FROM shopproduct
         WHERE quantity < 50 ) AS SP
        ON SP.product_id = P.product_id


多表连结： 适用于内连结和外连结 ON子句中可以使用逻辑运算符作为连结条件

### CROSS JOIN

交叉连结，笛卡尔积 交叉连结是对两张表中的全部记录进行交叉组合,因此结果中的记录数通常是两张表中行数的乘积.本例中,因为 shopproduct 表存在
13 条记录,product 表存在 8 条记录,所以结果中就包含了 13 × 8 = 104 条记录.

