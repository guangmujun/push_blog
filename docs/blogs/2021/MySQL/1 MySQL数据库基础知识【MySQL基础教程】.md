---
title: MySQL学习之MySQL数据库基础知识
date: 2020-12-14
permalink: /mysql-learning-base-knowledge.html
tags:
 - MySQL 
categories:
 - MySQL
---



## DB和DBMS

DB： DataBase，数据库 DBMS：DataBase Management Syste，数据库管理系统

## DBMS种类

  1. 通过数据的保存格式分类

  * 层次数据库，Hierarchical Database，HDB
  * 关系数据库，Relational Database， RDB
  * 面向对象数据库，Object Oriented Database，OODB
  * XML数据库，XMLDB
  * 键值存储系统，Key-Value Store，KVS

  2. 关系数据库管理系统的分类，RDBMS

  * Oracle：甲骨文
  * SQL Server：微软
  * PostgreSQL：开源
  * MySQL：开源

## RDBMS常见结构

  * 客户端向RDBMS发送SQL语句
  * RDBMS根据语句对DB操作
  * RDBMS将操作的结果反馈给客户端

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201214113600.png)

## SQL基础元素

  * 行：记录
  * 列：字段
  * 单元格：单元格
  * 表头：表头

## SQL语句分类

### DDL

数据定义语言，Data Definition Language，

  * CREATE：创建
  * DROP：删除
  * ALTER：修改

### DML【核心】

数据操纵语言，Data Manipualtion Language

  * SELECT：查询
  * INSERT：插入
  * UPDATE：更新
  * DELETE：删除

### DCL

数据控制语言，Data Control Language

  * COMMIT：确定对数据库中的数据进行的变更
  * ROLLBACK：取消对数据库中的数据进行的变更
  * GRANT：赋予用户操作权限
  * REVOKE：取消用户的操作权限

## SQL基本操作

### 书写规则

  * 以分号结尾
  * 不区分关键字的大小写，但是插入到表中的数据是区分大小写的
  * win系统默认不区分表名和字段名的大小写，而linux和max严格区分

### 创建数据库


​    
    CREATE DATABASE < 数据库名称 > ;


### 创建表


​    
    CREATE TABLE < 表名 >
    ( < 列名 1> < 数据类型 > < 该列所需约束 > ,
      < 列名 2> < 数据类型 > < 该列所需约束 > ,
      < 列名 3> < 数据类型 > < 该列所需约束 > ,
      < 列名 4> < 数据类型 > < 该列所需约束 > ,
      .
      .
      .
      < 该表的约束 1> , < 该表的约束 2> ,……);


### 命名规则

  * 只能使用半角英文字母、数字、下划线（_）作为数据库、表和列的名称
  * 名称必须以半角英文字母开头

### 数据类型

  * INTEGER 型：不能存储小数。

  * CHAR 型：用来存储定长字符串，由于会浪费存储空间，所以一般不使用。

  * VARCHAR 型：用来存储可变长度字符串。

  * DATE 型：日期型。

### 约束设置

  * `NOT NULL`是非空约束，即该列必须输入数据。

  * `PRIMARY KEY`是主键约束，代表该列是唯一值，可以通过该列取出特定的行的数据。

### 数据的删除

  * 删除表的语法

    
    
    DROP TABLE < 表名 > ;
    
  * 添加列的 ALTER TABLE 语句

    
    
    ALTER TABLE < 表名 > ADD COLUMN < 列的定义 >;
    ALTER TABLE product ADD COLUMN product_name_pinyin VARCHAR(100);
    
  * 删除列的 ALTER TABLE 语句

    
    
    ALTER TABLE < 表名 > DROP COLUMN < 列名 >;
    
  * 清空表内容，速度最快

    
    
    TRUNCATE TABLE TABLE_NAME;
    

### 数据的更新

  * 基本语法

    
    
    UPDATE <表名>
    SET <列名> = <表达式> [, <列名2>=<表达式2>...];  
    WHERE <条件>;  -- 可选，非常重要。
    ORDER BY 子句;  --可选
    LIMIT 子句; --可选
    
  * where条件

    
    
    -- 修改所有的注册时间
    UPDATE product
       SET regist_date = '2009-10-10';  
    -- 仅修改部分商品的单价
    UPDATE product
       SET sale_price = sale_price * 10
     WHERE product_type = '厨房用具';  
    
  * NULL清空

    
    
    -- 将商品编号为0008的数据（圆珠笔）的登记日期更新为NULL  
    UPDATE product
       SET regist_date = NULL
     WHERE product_id = '0008';  
    
  * SET多列

    
    
    -- 合并后的写法
    UPDATE product
       SET sale_price = sale_price * 10,
           purchase_price = purchase_price / 2
     WHERE product_type = '厨房用具';  
    

### 数据的插入

  * 基本语法

    
    
    INSERT INTO <表名> (列1, 列2, 列3, ……) VALUES (值1, 值2, 值3, ……);  
    
  * 插入一行

    
    
    INSERT INTO ProductIns 
    VALUES ('0005', '高压锅', '厨房用具', 6800, 5000, '2009-01-15');  
    
  * 插入多行

    
    
    INSERT INTO ProductIns VALUES ('0002', '打孔器', 
    '办公用品', 500, 320, '2009-09-11'),
    ('0003', '运动T恤', '衣服', 4000, 2800, NULL),
    ('0004', '菜刀', '厨房用具', 3000, 2800, '2009-09-20');  
    
  * 向某一列插入空值

    
    
    INSERT INTO ProductIns (product_id, product_name, product_type, 
    sale_price, purchase_price, regist_date) VALUES ('0006', '叉子', 
    '厨房用具', 500, NULL, '2009-09-20');  
    
  * 设置默认值

    
    
    CREATE TABLE ProductIns
    (product_id CHAR(4) NOT NULL,
    （略）
    sale_price INTEGER
    （略） DEFAULT 0, -- 销售单价的默认值设定为0;
    PRIMARY KEY (product_id));  
    
  * 插入其他表中的数据

    
    
    -- 将商品表中的数据复制到商品复制表中
    INSERT INTO ProductCopy (product_id, product_name, product_type, sale_price, purchase_price, regist_date)
    SELECT product_id, product_name, product_type, sale_price, 
    purchase_price, regist_date
    FROM Product;  
    

## 练习题

**1.1** 编写一条 CREATE TABLE 语句，用来创建一个包含表 1-A 中所列各项的表 Addressbook （地址簿），并为
regist_no （注册编号）列设置主键约束 表1-A 表 Addressbook （地址簿）中的列
![Z4El4zKbbWnaVHro](http://datawhale.club/uploads/default/original/1X/71f46b1e1a52c6504af2f7845d78971d5b47e971.png)


​    
    CREATE DATABASE shop;


​    
​    
    use shop;


​    
​    
    CREATE TABLE addressbook
    (regist_no INTEGER NOT NULL,
     name VARCHAR(128) NOT NULL,
     address VARCHAR(256) NOT NULL,
     tel_no CHAR(10) ,
     mail_address CHAR(20) ,
     PRIMARY KEY (regist_no));


**1.2** 假设在创建练习1.1中的 Addressbook 表时忘记添加如下一列 postal_code （邮政编码）了，请把此列添加到
Addressbook 表中。 列名 ： postal_code 数据类型 ：定长字符串类型（长度为 8） 约束 ：不能为 NULL


​    
    ALTER TABLE addressbook ADD COLUMN postal_code CHAR(8) NOT NULL;


**1.3** 编写 SQL 语句来删除 Addressbook 表。


​    
    TRUNCATE TABLE addressbook;


**1.4** 编写 SQL 语句来恢复删除掉的 Addressbook 表。 ALTER
和DROP执行后无法恢复，使用TRUNCATE清除数据后，有可能恢复，暂时不知道怎么恢复。

## 参考

> http://datawhale.club/t/topic/477

