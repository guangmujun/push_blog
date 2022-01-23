---
title: MySQL学习之MySQL复杂查询
date: 2020-12-18
permalink: /mysql-learning-diffcult-select.html
tags:
 - MySQL 
categories:
 - MySQL

---



## 视图

### 视图的定义

操作视图时会根据创建视图的SELECT语句生成一张虚拟表，然后在这张虚拟表上做SQL操作

### 视图的评价

  * 将频繁使用的SELECT语句保存
  * 不对外公开数据表全部字段，增强数据的保密性
  * 降低数据的冗余
  * 多重视图会降低SQL的性能

### 视图的使用

#### 创建视图

  1. 基于单表的视图


​    
    CREATE VIEW productsum(product_type, cnt_product)
    AS
    SELECT product_type, COUNT(*)
    FROM product
    GROUP BY product_type;


  2. 基于多表的视图


​    
    CREATE VIEW view_shop_product(product_type, sale_price, shop_name)
    AS
    SELECT product_type, sale_price, shop_name
    From product, shop_product
    WHERE product.product_id = shop_product.product_id;


  3. 基于视图的查询


​    
    SELECT sale_price, shop_name
    FROM view_shop_product
    WHERE product_type = '衣服';


#### 修改视图结构


​    
    ALTER VIEW productsum
    AS
    SELECT product_type, sale_price
    FROM product
    WHERE regist_data > '2019-09-11';


#### 更新视图内容

尽量不要通过视图来更新原来的表

#### 删除视图


​    
    DROP VIEW productsum;


### 视图的补充

多数DBMS中定义视图时不能使用ORDER BY语句，但是MySQL中视图的定义是允许使用的。

## 子查询

### 子查询的定义

一个查询语句嵌套在另一个查询语句内部的查询。

### 和视图的关系

  * 子查询就是将用来定义视图的SELECT语句直接用于FROM子句当中。

  * 子查询是一次性的，不会像视图那样保存在存储介质中，语句执行之后就消失

### 子查询的使用

#### 基础用法


​    
    SELECT stu_name
    FROM(
        SELECT stu_name, COUNT(*) AS stu_cnt
        FROM students_info
        GROUP BY stu_age) AS studentSum;


#### 标量子查询

查询结果只能是表中具体的某一行的某一列。 故其在使用单一值的位置都可以使用。


​    
    SELECT product_id, product_name, sale_price
    FROM product
    WHERE sale_price > (SELECT AVG(sale_price) FROM product);


​    
​    
    SELECT product_id, product_name, sale_price,
            (SELECT AVG(sale_price) FROM product) AS avg_price
    FROM product;


#### 关联子查询

关联子查询的逻辑和常规逻辑有所不同，详细可参考这篇[文章](https://zhuanlan.zhihu.com/p/41844742)
示例：查询出销售单价高于平均销售单价的商品


​    
    SELECT product_type, product_name, sale_price
    FROM product AS p1
    WHERE sale_price > (SELECT AVG (sale_price)
                        FROM product AS p2
                        WHERE p1.product_type = p2.product_type
                        GROUP BY product_type);


执行逻辑：

  * 先从主查询的product表中的product_type列取出第一个值，进入子查询中，替换`p1.product_type`，得到子查询结果，然后返回父查询，判断父查询的WHERE子句条件，然后返回整个语句的第一个结果。
  * 重复上述操作，知道所有主查询中的product表中国的product_type列记录取完位置，最终得出所有的查询结果。

## 练习题

**3.1** 创建出满足下述三个条件的视图（视图名称为 ViewPractice5_1）。使用 product（商品）表作为参照表，假设表中包含初始状态的
8 行数据。

  * 条件 1：销售单价大于等于 1000 日元。
  * 条件 2：登记日期是 2009 年 9 月 20 日。
  * 条件 3：包含商品名称、销售单价和登记日期三列。

对该视图执行 SELECT 语句的结果如下所示。


​    
    SELECT * FROM ViewPractice5_1;


执行结果


​    
    product_name | sale_price | regist_date
    --------------+------------+------------
    T恤衫         |   1000    | 2009-09-20
    菜刀          |    3000    | 2009-09-20


**Answer:**


​    
    CREATE VIEW ViewPractice5_1(product_name, sale_price, regist_date)
    AS
    SELECT product_name, sale_price, regist_date
    FROM product
    WHERE sale_price >= 1000 AND regist_data = '2009-09-20';


**3.2** 向习题一中创建的视图 ViewPractice5_1 中插入如下数据，会得到什么样的结果呢？


​    
    INSERT INTO ViewPractice5_1 VALUES (' 刀子 ', 300, '2009-11-02');


**Answer:** 视图数据更新，原表中部分数据更新，一般不这么操作。 **3.3** 请根据如下结果编写 SELECT 语句，其中
sale_price_all 列为全部商品的平均销售单价。


​    
    product_id | product_name | product_type | sale_price | sale_price_all
    ------------+-------------+--------------+------------+---------------------
    0001       | T恤衫         | 衣服         | 1000       | 2097.5000000000000000
    0002       | 打孔器        | 办公用品      | 500        | 2097.5000000000000000
    0003       | 运动T恤       | 衣服          | 4000      | 2097.5000000000000000
    0004       | 菜刀          | 厨房用具      | 3000       | 2097.5000000000000000
    0005       | 高压锅        | 厨房用具      | 6800       | 2097.5000000000000000
    0006       | 叉子          | 厨房用具      | 500        | 2097.5000000000000000
    0007       | 擦菜板        | 厨房用具       | 880       | 2097.5000000000000000
    0008       | 圆珠笔        | 办公用品       | 100       | 2097.5000000000000000


**Answer:**


​    
    CREATE VIEW productsum(product_id,product_name,
                           product_type,sale_price,sale_price_all)
    AS
    SELECT product_id,product_name,
            product_type,sale_price,SUM(sale_price)
    FROM product;


**3.4** 请根据习题一中的条件编写一条 SQL 语句，创建一幅包含如下数据的视图（名称为AvgPriceByType）。


​    
    product_id | product_name | product_type | sale_price | avg_sale_price
    ------------+-------------+--------------+------------+---------------------
    0001       | T恤衫         | 衣服         | 1000       |2500.0000000000000000
    0002       | 打孔器         | 办公用品     | 500        | 300.0000000000000000
    0003       | 运动T恤        | 衣服        | 4000        |2500.0000000000000000
    0004       | 菜刀          | 厨房用具      | 3000        |2795.0000000000000000
    0005       | 高压锅         | 厨房用具     | 6800        |2795.0000000000000000
    0006       | 叉子          | 厨房用具      | 500         |2795.0000000000000000
    0007       | 擦菜板         | 厨房用具     | 880         |2795.0000000000000000
    0008       | 圆珠笔         | 办公用品     | 100         | 300.0000000000000000


提示：其中的关键是 avg_sale_price 列。与习题三不同，这里需要计算出的 是各商品种类的平均销售单价。这与使用关联子查询所得到的结果相同。
也就是说，该列可以使用关联子查询进行创建。问题就是应该在什么地方使用这个关联子查询。 **Answer:**???


​    
    CREATE VIEW AvgPriceByType(product_id, product_name,  
                               product_type, sale_price,avg_sale_price)
    AS
    SELECT product_id,product_name,
           product_type,sale_price,
           (SELECT AVG (sale_price)
            FROM product AS p2
            WHERE p1.product_type = p2.product_type)
    FROM product AS p1;


## 函数

### 算数函数

  1. ABS：绝对值 `ABS(数值)`

  2. MOD：求余数 `MOD(被除数，除数)`

  3. ROUND：四舍五入 `ROUND(对象数值，保留小数的位数)`

### 字符串函数

  1. CONCAT：拼接 `CONCAT(str1, str2, str3)`

  2. LENGTH：字符串长度 `LENGTH(字符串)`

  3. LOWER：小写转换

  4. UPPER：大写转换

  5. REPLACE：字符串替换 `REPLACE(对象字符串， 替换前的字符串， 替换后的字符串)`

  6. SUBSTRING：字符串的截取 `SUBSTRING(对象字符串 FROM 截取的起始位置 FOR 截取的字符数)`

  7. SUBSTRING_INDEX：字符串按索引截取 `SUBSTRING_INDEX(原始字符串，分隔符，n)` 获取原始字符串按照分隔符分割后，第n个分隔符之前的子字符串，此时n为整数，如果n为负数，则是得到第|n|个分隔符之后的子字符串。

### 日期函数

  1. CURRENT_DATE：获取当前日期

  2. CURRENT_TIME：获取当前时间

  3. CURRENT_TIMESTAMP：获取当前日期和时间

  4. EXTRACT：截取日期元素 `EXTRACT(日期元素 FROM 日期)`
        
        SELECT CURRENT_TIMESTAMP as now,

    EXTRACT(YEAR   FROM CURRENT_TIMESTAMP) AS year,
    EXTRACT(MONTH  FROM CURRENT_TIMESTAMP) AS month,
    EXTRACT(DAY    FROM CURRENT_TIMESTAMP) AS day,
    EXTRACT(HOUR   FROM CURRENT_TIMESTAMP) AS hour,
    EXTRACT(MINUTE FROM CURRENT_TIMESTAMP) AS MINute,
    EXTRACT(SECOND FROM CURRENT_TIMESTAMP) AS second;
    +---------------------+------+-------+------+------+--------+--------+
    | now                 | year | month | day  | hour | MINute | second |
    +---------------------+------+-------+------+------+--------+--------+
    | 2020-08-08 17:34:38 | 2020 |     8 |    8 |   17 |     34 |     38 |
    +---------------------+------+-------+------+------+--------+--------+
    1 row in set (0.00 sec)


### 转换函数

  * 数据类型转换
  * 值的转换

  1. CAST：类型转换 `CAST(转换前的值 AS 想要转化的数据类型)`

  2. COALESCE：将NULL转换为其他值 `COALESCE(数据1，数据2，……)` 返回左侧开始第一个不是NULL的值

## 谓词

### LIKE

用字符串的部分一致查询

  * 前方一致：如`ddd%`
  * 中间一致：如`%ddd%`，包含前方一致和后方一直的查询结果
  * 后方一致：如`%ddd`

示例：


​    
    SELECT *
    FROM samplelike
    WHERE strcol LIKE 'ddd%';


### BETWEEN

用于范围查询


​    
    SELECT product_name, sale_price
    FROM product
    WHERE sale_price BETWEEN 100 AND 1000;


### IS NULL

判断否为NULL，IS NULL， IS NOT NULL

### IN

可以替代多个`OR`


​    
    SELECT product_name, purchase_price
    FROM product
    WHERE purchase_price IN (320, 500, 5000);


使用子查询作为IN谓语的参数


​    
    SELECT product_name, sale_price
    FROM product
    WHERE product_id IN (SELECT product_id
      FROM shopproduct
                           WHERE shop_id = '000C');


### EXIST

**判断是否存在满足某种条件的记录** 在右侧书写 1 个参数，该参数通常都会是一个子查询。 EXIST 通常会使用关联子查询作为参数。 EXIST
只关心记录是否存在. EXIST 只会判断是否存在满足子查询中 WHERE 子句指定的条件“商店编号（shop_id）为
‘000C’，商品（product）表和商店


​    
    SELECT product_name, sale_price
      FROM product AS p
     WHERE EXISTS (SELECT *
                     FROM shopproduct AS sp
                    WHERE sp.shop_id = '000C'
                      AND sp.product_id = p.product_id);
    +--------------+------------+
    | product_name | sale_price |
    +--------------+------------+
    | 运动T恤      |       4000 |
    | 菜刀         |       3000 |
    | 叉子         |        500 |
    | 擦菜板       |        880 |
    +--------------+------------+
    4 rows in set (0.00 sec)


NOT EXIST

### CASE表达式

#### 基本定义

CASE表达式的语法分为简单CASE表达式和搜索CASE表达式两种。由于搜索CASE表达式包含简单CASE表达式的全部功能。本课程将重点介绍搜索CASE表达式。
语法：


​    
    CASE WHEN <求值表达式> THEN <表达式>
         WHEN <求值表达式> THEN <表达式>
         WHEN <求值表达式> THEN <表达式>
         .
         .
         .
    ELSE <表达式>
    END  


上述语句执行时，依次判断 when 表达式是否为真值，是则执行 THEN 后的语句，如果所有的 when 表达式均为假，则执行 ELSE 后的语句。
无论多么庞大的 CASE 表达式，最后也只会返回一个值。

#### 使用方法

  1. 根据不同分支得到不同列值 
        
        SELECT  product_name,
           CASE WHEN product_type = '衣服' THEN CONCAT('A ： ',product_type)
                WHEN product_type = '办公用品'  THEN CONCAT('B ： ',product_type)
                WHEN product_type = '厨房用具'  THEN CONCAT('C ： ',product_type)
                ELSE NULL
           END AS abc_product_type
     FROM  product;

    +--------------+------------------+
    | product_name | abc_product_type |
    +--------------+------------------+
    | T恤          | A ： 衣服        |
    | 打孔器       | B ： 办公用品    |
    | 运动T恤      | A ： 衣服        |
    | 菜刀         | C ： 厨房用具    |
    | 高压锅       | C ： 厨房用具    |
    | 叉子         | C ： 厨房用具    |
    | 擦菜板       | C ： 厨房用具    |
    | 圆珠笔       | B ： 办公用品    |
    +--------------+------------------+
    8 rows in set (0.00 sec)


  2. 列方向上的聚合 
        
        -- 对按照商品种类计算出的销售单价合计值进行行列转换

    SELECT SUM(CASE WHEN product_type = '衣服' THEN sale_price ELSE 0 END) AS sum_price_clothes,
          SUM(CASE WHEN product_type = '厨房用具' THEN sale_price ELSE 0 END) AS sum_price_kitchen,
          SUM(CASE WHEN product_type = '办公用品' THEN sale_price ELSE 0 END) AS sum_price_office
     FROM product;
    +-------------------+-------------------+------------------+
    | sum_price_clothes | sum_price_kitchen | sum_price_office |
    +-------------------+-------------------+------------------+
    |              5000 |             11180 |              600 |
    +-------------------+-------------------+------------------+
    1 row in set (0.00 sec)


  3. 实现行转列 
        
        -- CASE WHEN 实现数字列 score 行转列

    SELECT name,
          SUM(CASE WHEN subject = '语文' THEN score ELSE null END) as chinese,
          SUM(CASE WHEN subject = '数学' THEN score ELSE null END) as math,
          SUM(CASE WHEN subject = '外语' THEN score ELSE null END) as english
     FROM score
    GROUP BY name;
    +------+---------+------+---------+
    | name | chinese | math | english |
    +------+---------+------+---------+
    | 张三 |      93 |   88 |      91 |
    | 李四 |      87 |   90 |      77 |
    +------+---------+------+---------+
    2 rows in set (0.00 sec)


## 练习题

**3.5** 运算或者函数中含有 NULL 时，结果全都会变为NULL ？（判断题）False **3.6** 对本章中使用的
product（商品）表执行如下 2 条 SELECT 语句，能够得到什么样的结果呢？ ①商品进价不是500或2800或5000


​    
    SELECT product_name, purchase_price
      FROM product
     WHERE purchase_price NOT IN (500, 2800, 5000);


②商品进价不是500或2800或500或NULL


​    
    SELECT product_name, purchase_price
      FROM product
     WHERE purchase_price NOT IN (500, 2800, 5000, NULL);


**3.7** 按照销售单价（ sale_price）对练习 6.1 中的 product（商品）表中的商品进行如下分类。

  * 低档商品：销售单价在1000日元以下（T恤衫、办公用品、叉子、擦菜板、 圆珠笔）
  * 中档商品：销售单价在1001日元以上3000日元以下（菜刀）
  * 高档商品：销售单价在3001日元以上（运动T恤、高压锅）

请编写出统计上述商品种类中所包含的商品数量的 SELECT 语句，结果如下所示。 执行结果


​    
    low_price | mid_price | high_price
    ----------+-----------+------------
            5 |         1 |         2


​    
​    
    SELECT 
    COUNT
    (CASE WHEN sale_price < 1000 THEN DISTINCT product_type ELSE 0 END) 
    AS low_price,
    COUNT
    (CASE WHEN sale_price BETWEEN 1000 AND 3000 THEN DISTINCT product_type ELSE 0 END) 
    AS mid_price,
    COUNT
    (CASE WHEN sale_price > 3000 THEN DISTINCT product_type ELSE 0 END) 
    AS high_price,
    FROM product;

