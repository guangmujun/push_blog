---
title: CH1 初始Spring Boot，开发社区首页【牛客网社区论坛项目】
date: 2021-01-29
permalink: /other-spring-boot-niuke.html
tags:
 - 其他
 - SpringBoot
categories:
 - 其他
---

## 1.1 项目介绍

### 项目目标

  * 学会主流Web开发技术和框架
  * 积累一个真实的Web项目的开发经验：牛客网社区论坛
  * 掌握热点面试题的答题策略

### 技术架构

  * Spring Boot（简化Spring）
  * Spring、Spring MVC、MyBatis（SSM）
  * Redis、Kafka、Elasticsearch（缓存、消息队列、搜索）
  * Spring Security、Spring Actuator（系统安全、系统监控）

### 开发环境

  * 构建工具：Apache Maven
  * 集成开发工具：IntelliJ IDEA
  * 数据库：MySQL、Redis
  * 应用服务器：Apache Tomcat
  * 版本控制：Git

## 1.2 开发环境搭建

### Maven安装

  1. 下载和解压 
        1. 网站：http://maven.apache.org/download.cgi

            2. 下载文件 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112140919.png)

                3. 解压文件到一个固定目录

  2. 配置镜像仓库 
        1. 打开conf文件夹下的settings.xml文件

            2. 添加以下内容 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112141101.png)

                3. 补充，阿里云的maven镜像仓库网址，https://maven.aliyun.com/mvn/view

  3. 将maven添加到环境变量 
        1. 找到maven解压文件夹中的bin目录，如：`D:\Program Files\Java\apache-maven-3.6.3\bin`
            2. 将其添加到【系统变量】的【Path变量】中
                3. 打开命令行，输入`mvn -version`测试
  4. mvn常用命令 
        1. 官网有相关的教程http://maven.apache.org/guides/getting-started/maven-in-five-minutes.html

            2. 创建一个项目 
      1. cd 到一个文件夹中

      2. 输入命令 `mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=my-app -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false`

      3. 其中，`DgroupId`表示com+公司名+项目名，`DartifactId`表示项目名，`DarchetypeArtifactId`表示使用的模板名称，`DinteractiveMode`表示是否使用交互模式

      4. 命令运行完成后，会在目录下生成项目名称文件夹，其中包含：src文件夹和pom.xml文件

        3. 编译项目 
      1. 进入到项目文件夹目录下
      2. 输入以下命令进行编译，`mvn compile`，会生成target文件夹
      3. 输入以下命令进行编译的清除，`mvn clean`，会清除target文件夹
      4. 输入以下命令进行编译和测试，`mvn test`，会编译并测试项目
      ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112143242.png)

### IDEA下载和配置

  1. 下载 官网下载，正常安装即可

  2. 配置Maven 
        1. 双击IDEAN图标

            2. 点击IDEA的的Configure按钮

                3. 选择Maven解压的文件夹，选择重新设置过镜像仓库的settings.xml文件 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112144007.png)

  3. 创建Maven项目 
        1. 点击New Project按钮后

            2. 选择使用下载的JDK，按模板新建Maven项目 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112144428.png)

                3. 配置项目名称、位置、版本号等 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112144652.png)

                    4. 确定配置信息是否有问题 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112144816.png)

  4. IDEA中使用Maven 
        1. 点击右侧的Maven命令后，即可执行

            2. 或者使用快捷键Ctrl+F9 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112145455.png)

### IDEA快捷键

IDEA增加接口的未实现的方法的快捷键：`Alt+Enter` ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210113191954.png)
IDEA中打出`System.out.println();`的快捷键：`sout` IDEA中查找类的快捷键：`Ctrl+n` 快速插入语句：比如try
catch，快捷键`Ctrl+Alt+T` 编译快捷键：`Ctrl+F9` 快速插入get，set或toString方法：`Alt+Ins`

### Spring Initializr

底层是基于Maven，主要是对常用的包进行了整合，比如进行Web开发，使用Maven的话可能要一个一个去下载依赖包，而使用Spring
Initializr则可以一次性将相关的包全部下载。

  1. 到spring initializr官网https://start.spring.io/进行配置和生成 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112162218.png)

  2. 解压下载文件到固定文件夹，并使用IDEA打开，IDEA会自动下载包，需要稍等一会，加载完成后，可以看到许多库文件已经安装好 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112194525.png)

  3. 运行项目，启动服务器 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112194633.png)

  4. 在浏览器中输入`localhost:8080`，效果如下： ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112194742.png)

### Spring Boot示例

Spring Boot核心作用：

  * 起步依赖：为项目提供初始的大量的依赖包
  * 自动配置：自动配置启动的参数
  * 端点监控：项目上线后检测运行情况

示例：一个简单的处理客户端请求案例

  1. 新建一个类，内容如下 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112195725.png)

  2. 使用快捷键`Ctrl+F9`重新编译项目，浏览器中输入`localhost:8080/alpha/hello`，如下： ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112195908.png)

  3. 如果8080端口被占用，可以对Tomcat的端口进行修改，打开application.properties文件，输入以下内容，重新编译，浏览器中输入`localhost:8080/community/alpha/hello`可正常访问 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210112200328.png)

## 1.3 Spring入门

是一套框架，官网：https://spring.io **Spring全家桶**

  * Spring Framework：核心
  * Spring Boot：基本Web开发
  * Spring Cloud：微服务
  * Spring Cloud Data Flow：数据集成

**Spring Framework**

  * Spring Core 
    * IoC、AOP：管理、整合
  * Spring Data Access 
    * Transcations、Spring MyBatis
  * Web Servlet 
    * Spring MVC
  * Integration 
    * Email、Scheduling、AMQP、Security

**Spring Ioc**

  * Inversion of Control 
    * 控制反转，是一种面向对象编程的设计思想
    * 降低了耦合性
  * Dependency Injection 
    * 依赖注入，是IoC思想的实现方式
  * IOC Container 
    * IOC容器，是实现依赖注入的关键，本质上是一个工厂
    ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210113185836.png)

## 1.4 Spring MVC入门

### HTTP

  * Hyper Text Transfer Protocol
  * 用于传输HTML等内容的应用层协议
  * 规定了浏览器和服务器之间如何通信，以及通信时的数据格式
  * 学习网址：https://developer.mozilla.org/zh-CN/

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210114150013.png)

### Spring MVC

  * 三层架构 
    * 表现层、业务层、数据访问层
    * 表现层访问业务层，业务层访问数据层
  * MVC（主要解决表现层的事情） 
    * Model：模型层，是view和controller的纽带
    * View：视图层，渲染界面
    * Controller：控制层，处理业务
  * 核心组件： 
    * 前端控制器：DispatcherServlet

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210114151104.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210114151716.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210114151904.png)

### Thymeleaf

  * 模板引擎 
    * 生成动态的HTML
  * Thymeleaf 
    * 倡导自然模板，以HTML文件为模板
  * 常用语法 
    * 标准表达式、判断与循环、模板的布局

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210114152204.png)

## 1.5 Mybatis入门

是访问数据库的框架。

### 安装数据库

  * 安装MySQL Server（服务端）
  * 安装MySQL Workbench（客户端）

#### 安装MySQL Server

用户名：MySQL80 密码：123456 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116093056.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116093152.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116093232.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116093258.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116093425.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116093518.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116093543.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116093606.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116093641.png)

#### 配置MySQL Server

将MySQL Server的bin目录添加到环境变量，如，我的路径是：`C:\Program Files\MySQL\MySQL Server
8.0\bin`

#### 使用MySQL

  1. 打开命令行，输入`mysql -uroot -p`，然后输入密码，登录MySQL ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116095207.png)

  2. 创建数据库，`create database community;`

  3. 查看数据库，`show databases;`

  4. 切换到数据库，`use community;`

  5. 导入表，进入到存放`init_schema.sql`的目录，`source init_schema.sql;`

  6. 查看所有的表，`show tables;`

  7. 导入数据，`source init_data.sql;`

  8. 查看具体的表内容，`select * from user;`

  9. 退出，`exit`

#### 安装MySQL Workbench

一步步的安装就可以。

#### 配置MySQL Workbench

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116101043.png)
配置密码和库名 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116101155.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116101221.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116101317.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116101436.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116101607.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116101550.png)

### MyBatis安装和配置

#### 介绍

  * 核心组件 
    * SqlSessionFactory：用于创建SqlSession的工厂类
    * SqlSession：MyBatis的核心组件，用于向数据库执行SQL
    * 主配置文件：XML配置文件，可以对MyBatis的底层行为作出详细的配置
    * Mapper接口：就是DAO接口，在MyBatis中习惯性的称之为Mapper
    * Mapper映射器：用于编写SQL，并将SQL和实体类映射的组件，采用XML、注解均可实现
  * 示例 
    * 使用MyBatis对用户表进行CURD操作（增删改查操作）
  * 网站 
    * http://www.mybatis.org/mybatis-3
    * http://www.mybatis.org/spring

#### 导入依赖

  1. mvn仓库：https://mvnrepository.com/
  2. 导入MySQL包

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116103824.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116103902.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116103928.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116104041.png)

  3. 导入MyBatis Spring Boot Starter包

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116104439.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116104459.png)
点击下图所示按钮，更新依赖，依赖安装完成后，字母的颜色由红色变为白色。 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116104548.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116104622.png)

#### MyBatis配置

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116105631.png)


​    
    # ServerProperties
    server.port=8080
    server.servlet.context-path=/community
    
    # ThymeleafProperties
    spring.thymeleaf.cache=false
    
    # DataSourceProperties
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
    spring.datasource.url=jdbc:mysql://localhost:3306/community?characterEncoding=utf-8&useSSL=false&serverTimezone=Hongkong
    spring.datasource.username=root
    spring.datasource.password=123456
    spring.datasource.type=com.zaxxer.hikari.HikariDataSource
    spring.datasource.hikari.maximum-pool-size=15
    spring.datasource.hikari.minimum-idle=5
    spring.datasource.hikari.idle-timeout=30000
    
    # MybatisProperties
    mybatis.mapper-locations=classpath:mapper/*.xml
    mybatis.type-aliases-package=com.nowcoder.community.entity
    mybatis.configuration.useGeneratedKeys=true
    mybatis.configuration.mapUnderscoreToCamelCase=true


## 1.6 开发社区首页

### 介绍

  * 开发流程 
    * 1次请求的执行过程
    * 先开发DAO，再Service，最后Controller
    ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116142028.png)

  * 分步实现 
    * 开发社区首页，显示前10个帖子
    * 开发分页组件，分页显示所有的帖子

### 问题

使用模板时出错，`Error resolving template template might not exist or might not be
accessible` 解决：
thymleaf模板的HTML文件必须是HTML5版本的文件，如果不是的话，那就从idea重新创建一个HTML5文件，然后将之前的文件内容拷贝一份到新创建的HTML5文件中。
转载于:https://www.cnblogs.com/jums/p/11312030.html ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210116163002.png)

## 1.7 项目调试技巧

### 介绍

  * 响应状态码的含义
  * 服务端断点调试技巧
  * 客户端断点调试技巧
  * 设置日志级别，并将日志输出到不同的终端

### 服务端调试

程序向下执行一行：`F8` 进入到当前行所调用的方法内部：`F7`（`F8`返回） 程序直接向下执行到下一个断点位置：`F9` 断点管理：
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116194634.png)

### 客户端调试

  1. 打断点 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116200700.png)

  2. 运行到断点的效果 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116200811.png)

  3. 调试快捷键 
        1. 向下执行一行`F10`
            2. 进入到方法的内部`F11`
                3. 程序执行到底`F8`
  4. 断点管理 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116201007.png)

  5. 变量值的展示 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210116201112.png)

### 输出日志

https://logback.qos.ch/

### 问题

程序运行后，在浏览器中打开网站，但是js显示404？ 解决：
查看target目录下是否有js文件，没有的话，则使用maven的clean命令清除下，然后再编译运行。 ![](https://my-imags.oss-
cn-shanghai.aliyuncs.com/pic/20210116200413.png)

## 1.8 版本控制

资料：git官网的书https://git-scm.com/book/zh/v2

### Git操作

  1. 查看已有配置 
        
        git config --list


  2. 配置用户名和邮箱 
        
        git config --global user.name "your-name"

    git config --global user.email "your-email"


  3. 进入到项目文件夹 
        
        cd


  4. 初始化 
        
        git init


  5. 查看git状态 
        
        git status


  6. 添加文件 
        
        git add .


  7. 提交文件 
        
        git commit -m "message"


  8. 创建密钥 
        
        ssh-keygen -t rsa -C "your-email"


  9. 远程仓库添加密钥设置，新建项目

  10. 关联远程仓库，取名，叫做origin 
        
        git remote add origin your-https


  11. 本地代码上传到远程仓库，上传到origin仓库的master分支，输入账号密码 
        
        git push -u origin master


### IDEA中配置Git

  1. 设置git的路径

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210113205059.png)

  2. 创建git仓库

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210113205156.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210113205232.png)

  3. 提交代码到本地仓库

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210113205429.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210113205613.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210113205631.png)

  4. 在git或gitee等上，新建远程仓库

  5. push本地仓库到远程

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210113205924.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210113210005.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210113210055.png)

  6. 代码成功提交到Gitee等远程仓库

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210113210151.png)

