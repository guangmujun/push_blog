---
title: Java学习之Java数据库操作,JDBC编程的快速入门教程
date: 2020-12-17
permalink: /java-learning-jdbc.html
tags:
 - Java
categories:
 - Java

---



## 安装MySQL

Linux环境MySQL的安装、配置以及远程连接和可视化等操作，请详细参考这篇[博文](https://guangmujun.cn/archives/371)

## JDBC编程

### JDBC应用原理

为了解决不同数据库各自为政的问题，Java设计了统一的规范JDBC，只要程序员按照JDBC的方法操作，任何数据库都可以在JDBC框架下正常访问。
JDBC（Java DataBase
Connectivity，Java数据库连接），由JDK内部的数据库管理工具类组成，提供标准的数据库操作方法，使用统一的方式开展数据库编程，提高数据库编程的开发效率。

### 连接器设置

JDBC屏蔽了相关的内部细节，在具体操作数据库之前，需要额外的引入对应的数据库连接器，即导入对应数据库的JAR包

#### 下载连接器

MySQL的Java版本连接器 网址：https://dev.mysql.com/downloads/connector/j/

  1. 查看ubuntu版本的命令：


​    
    cat /proc/version


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201217143355.png)

  2. 下载对应版本的连接器

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201217143432.png)

  3. 不用登陆，点击此处，直接下载

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201217143507.png)

#### 安装连接器

我这里下载的位`.deb`文件，在文件下载目录，打开终端，输入以下命令，进行安装：


​    
    wyh@ubuntu:~/IdeaProjects$ sudo dpkg -i mysql-connector-java_8.0.22-1ubuntu20.04_all.deb 


安装完成后，输入以下命令，查看安装的数据库JAR包所在的路径


​    
    wyh@ubuntu:~/IdeaProjects$ dpkg -L mysql-connector-java


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201217144914.png)

#### 导入JAR包

**IDEA把数据库连接的JAR文件添加到Java工程的依赖库中** ，之后即可在Java代码中操作MySQL数据库 点击【File】，点击【Project
Structure】 点击【Modules】，点击【Dependencies】，点击【+】，选择【JARs or Directories…】
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201217145229.png)
输入或者选择前述查看的mysql-connector的JAR包的路径，然后点击OK，完成配置 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20201217145341.png)

### 连接数据库

  * 加载数据库驱动
  * 根据用户名和密码连接数据库

Java编程实现对MySQL数据库的连接


​    
    package com.jiangsu.nanjing;
    
    import java.sql.Connection;
    import java.sql.DriverManager;
    import java.sql.SQLException;
    
    public class TestConnect {
        public static void main(String[] args){
            TestMySQL();
        }
    
        private static void TestMySQL(){
            String driver_class = "com.mysql.cj.jdbc.Driver";  //数据库的驱动类
            //数据库的连接地址，包括：数据库类型、IP、端口号、名称、时区
            String dbUrl = "jdbc:mysql://192.168.88.129:3306/product?serverTimezone=GMT%2B8";
            String dbUsername = "root";       //数据库的用户名
            String dbPassword = "MyPass@123"; //数据库的密码
            try{
                Class.forName(driver_class);  //加载数据库的驱动
                //连接数据库
                try(Connection conn = DriverManager.getConnection(dbUrl, dbUsername, dbPassword)){
                    String desc = String.format("Database: %s, Connect Status: %s, Auto Commit: %s",
                            conn.getCatalog(),
                            conn.isClosed()?"Close":"Open",
                            conn.getAutoCommit()?"Open":"Close");
                    System.out.println(desc);
                }catch (SQLException e){
                    e.printStackTrace();
                }
            }catch (ClassNotFoundException e){
                e.printStackTrace();
            }
        }
    }


​    

### 管理数据库

#### 创建表格


​    
    package com.jiangsu.nanjing;
    
    import javax.swing.plaf.nimbus.State;
    import java.sql.Connection;
    import java.sql.DriverManager;
    import java.sql.SQLException;
    import java.sql.Statement;
    
    public class TestConnect {
        public static void main(String[] args){
            TestMySQL();
        }
    
        private static void TestMySQL(){
            String driver_class = "com.mysql.cj.jdbc.Driver";  //数据库的驱动类
            //数据库的连接地址，包括：数据库类型、IP、端口号、名称、时区
            String dbUrl = "jdbc:mysql://192.168.88.129:3306/product?serverTimezone=GMT%2B8";
            String dbUsername = "root";       //数据库的用户名
            String dbPassword = "MyPass@123"; //数据库的密码
            try{
                Class.forName(driver_class);  //加载数据库的驱动
                //连接数据库
                try(Connection conn = DriverManager.getConnection(dbUrl, dbUsername, dbPassword)){
                    //输出连接信息
                    String desc = String.format("Database: %s, Connect Status: %s, Auto Commit: %s",
                            conn.getCatalog(),
                            conn.isClosed()?"Close":"Open",
                            conn.getAutoCommit()?"Open":"Close");
                    System.out.println(desc);
                    //创建连接的执行报告
                    Statement stmt = conn.createStatement();
                    //执行SQL操作
                    createTable(stmt);
    
                }catch (SQLException e){
                    e.printStackTrace();
                }
            }catch (ClassNotFoundException e){
                e.printStackTrace();
            }
        }
    
        // 创建表格
        private static void createTable(Statement stmt) throws SQLException{
            String sql = "create table teacher("            //"+"这个只是起到一个语句之间的连接作用
                    +" id INT NOT NULL,"
                    +" name VARCHAR(32) NOT NULL,"
                    +" sex INT NOT NULL,"
                    +" course VARCHAR(32) NOT NULL,"
                    +" PRIMARY KEY (id))"
                    +" comment= 'Teacher Info Table';";
            int count = stmt.executeUpdate(sql);  // 返回受影响的记录的数量
            System.out.println(count);
        }
    
    }


​    

#### 插入数据


​    
        //插入记录
        private static void insertRecord(Statement stmt) throws SQLException{
            List sqlList = Arrays.asList(
                    "insert into teacher VALUES (1, 'Li', 1, 'Math')",
                    "insert into teacher VALUES (2, 'Wang', 0, 'English')",
                    "insert into teacher VALUES (3, 'Han', 1, 'Chinese')"
            );
            for (String sql : sqlList){
                int count = stmt.executeUpdate(sql);
                System.out.println(count);
            }
    
        }


#### 更新数据


​    
        //更新数据
        private static void updateRecord(Statement stmt) throws SQLException{
            String sql = "update teacher set course='History' where sex ='1'";
            int count = stmt.executeUpdate(sql);
            System.out.println(count);
        }


### 查询数据库

使用单独的exceuteQuery方法，该方法的返回值是ResultSet类型


​    
    //查询性别分组
        private static void showRecordGroupBySex(){
            String driver_class = "com.mysql.cj.jdbc.Driver";  //数据库的驱动类
            //数据库的连接地址，包括：数据库类型、IP、端口号、名称、时区
            String dbUrl = "jdbc:mysql://192.168.88.129:3306/product?serverTimezone=GMT%2B8";
            String dbUsername = "root";       //数据库的用户名
            String dbPassword = "MyPass@123"; //数据库的密码
            String sql = "select sex, count(sex) count from teacher group by sex order by sex asc";
            try{
                Class.forName(driver_class);  //加载数据库的驱动
                //连接数据库
                try(Connection conn = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery(sql)){
                    while (rs.next()){  //循环遍历结果集里面的所有记录
                        int sex = rs.getInt("sex");  //获取指定字段的整型值
                        int count = rs.getInt("count");
                        String desc = String.format("The Number of %s Teacher is %s.",
                                sex==0 ? "Man" : "Women", count);
                        System.out.println(desc);
                    }
                }catch (SQLException e){
                    e.printStackTrace();
                }
            }catch (ClassNotFoundException e){
                e.printStackTrace();
            }
        }


### 预报告PreparedStatement

在写SQL语句时，可以把查询条件作为输入参数传进来，正常输入一个正常的参数传进来没问题，但是如果，这个输入否参数被设置为一些特殊的语句，那输入到函数后，这个输入参数就与函数中的原有SQL语句合并生成新的SQL语句，由此便可能会产生安全问题，此类的SQL缺陷称为SQL注入漏洞。
JDBC设计了一种预报告机制，在创建预报告对象时就要设定SQL语句，并且SQL里面的动态参数以问号代替


​    
    String sql = "delete from teacher where course=?";
    PreparedStatement stmt = conn.prepareStatement(sql);


使用setString方法设置对应序号的参数值


​    
    stmt.setString(1, "化学");
    stmt.setString(1, "'' or 1=1")


## 数据库连接池

### 出现的原由

对于数据库连接的管理，每次操作完数据都要关闭连接，频繁的开关数据库连接会加重CPU的负担。
类似于线程池的概念，提出连接池，事先在一个池子中容纳若干连接，需要使用时便从中挑选一个。
Java没有推出类似连接池的工具，于是第三方蜂拥而起，国外的C3P0，阿里巴巴的Druid

### C3P0连接池

在Java Web领域应用良好，但不适用于大型应用场合

### Druid连接池

**准备操作：**
因为Druid是第三方提供，所以想要使用Druid，则需要导入相关的JAR到项目中，下载JAR包，点击[这里](https://guangmujun.cn/archives/383)，导入JAR包的操作可以参考本文这个章节的内容：[导入JAR包](https://guangmujun.cn/archives/385#JAR)
**两个步骤：**

  1. 初始化连接池


​    
    //声明Durid连接池的对象
    private static DruidDataSource dataSource;


​    
​    
        //初始化连接池
        private static void initDataSource(){
            String driver_class = "com.mysql.cj.jdbc.Driver";  //数据库的驱动类
            //数据库的连接地址，包括：数据库类型、IP、端口号、名称、时区
            String dbUrl = "jdbc:mysql://192.168.88.129:3306/product?serverTimezone=GMT%2B8";
            String dbUsername = "root";       //数据库的用户名
            String dbPassword = "MyPass@123"; //数据库的密码
            dataSource = new DruidDataSource();             //创建连接池
            dataSource.setDriverClassName(driver_class);
            dataSource.setUrl(dbUrl);
            dataSource.setUsername(dbUsername);
            dataSource.setPassword(dbPassword);
            dataSource.setInitialSize(1);                   //设置连接池的初始大小
            dataSource.setMinIdle(1);                       //设置连接池大小的下限
            dataSource.setMaxActive(20);                    //设置连接池大小的上限
        }


  2. 处理连接


​    
    //显示性别分组
        private static void showRecordGroupBySex(){
            String sql = "select sex, count(1) count from teacher group by sex order by sex asc";
            try(DruidPooledConnection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)){
                while (rs.next()){
                    int sex = rs.getInt("sex");
                    int count = rs.getInt("count");
                    String desc = String.format("The Number of %s Teacher is %s",
                            sex==0?"Man":"Woman", count);
                    System.out.println(desc);
                }
                System.out.println(dataSource.getActiveCount());
                System.out.println(dataSource.getConnectCount());
                System.out.println(dataSource.getPoolingCount());
            }catch (SQLException e){
                e.printStackTrace();
            }
        }


  3. 主函数


​    
        public static void main(String[] args){
            initDataSource();
            for (int i=0; i<3; i++){
                showRecordGroupBySex();
            }
        }


## 资源下载

Druid的JAR包，[下载连接](https://guangmujun.cn/archives/383)

