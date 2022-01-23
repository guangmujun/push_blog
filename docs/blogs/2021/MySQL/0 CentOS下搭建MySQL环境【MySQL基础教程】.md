---
title: MySQL学习之CentOS下搭建MySQL环境
date: 2020-12-14
permalink: /mysql-learning-centos-env.html
tags:
 - MySQL
 - CentOS 
categories:
 - MySQL
---



## 环境

CentOS 7 MySQL 8.0

## 安装步骤

  1. 打开CentOS系统，先连上网络

  2. 在终端输入以下命令，下载RPM包 
        
        wget https://dev.mysql.com/get/mysql80-community-release-el7-2.noarch.rpm


  3. 使用yum命令安装下载好的资源包，如果直接输入以下命令提示root权限不够，请转到问题1 
        
        yum -y install mysql80-community-release-el7-2.noarch.rpm


  4. 安装MySQL服务器 
        
        yum -y install mysql-community-server


  5. 出现下图所示界面，表示MySQL安装成功，成功替换了系统默认安装的Mariadb ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201214102551.png)

## MySQL数据库设置

  1. 启动MySQL 
        
        systemctl start  mysqld.service


  2. 查看MySQL运行状态 
        
        systemctl status mysqld.service


  3. 重启和停止MySQL命令 
        
        service mysqld restart

    systemctl stop mysqld.service 


  4. 查看MySQL初始的随机密码，查看之前确保启动过一次MySQL 
        
        grep 'temporary password' /var/log/mysqld.log


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201214103036.png)

  5. 登录root用户 
        
        mysql -u root -p


  6. 修改MySQL的密码，MySQL对密码设置有要求，先输入下面的前两行命令解除约束，然后输入第三行命令修改MYSQL的密码 
        
        set global validate_password.policy=0;

    set global validate_password.length=4; 
    ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';


补充知识： 在 CentOS 中 MySQL 的主要配置所在的目录：


​    
    /etc/my.cnf         l 的主配置文件
    /var/lib/mysql      mysql 数据库的数据库文件存放位置
    /var/log mysql      数据库的日志输出存放位置


## 设置远程连接

### CentOS上的远程连接设置

  1. 假设我们现在是在一个新开的终端上，先登录mysql，输入密码，就是123465那个 
        
        mysql -u root -p


  2. 查看user表中的user和host信息 
        
        use mysql;

    select user,host from user;


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201214110232.png)

  3. 修改root对应的host为%，host列指定了允许用户登录所使用的IP，localhost的意思是这个账号只能本地使用，%是通配符，表示任意的IP都可以使用 
        
        update user set host = '%' where user = 'root';


  4. 设置远程登录的密码 
        
        ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY'MyPass@123';


  5. 输入exit退出mysql，开启防火墙的3306端口，重新加载防火墙，重新启动mysql服务 
        
        firewall-cmd --zone=public --add-port=3306/tcp --permanent

    firewall-cmd --reload
    service mysqld restart


### 客户端工具连接MySQL

在win10系统下使用HeidiSQL工具连接CnetOS系统上的MySQL

  1. 下载HeidiSQL工具，[官网](https://www.heidisql.com/download.php)，可以下载portable的便携版本，下载解压后，点击exe图标即可运行

  2. 确保CentOS系统上的MySQL处在运行状态，输入以下命令查看，确保是running 
        
        systemctl status mysqld.service


  3. 查看CentOS系统的IP，我的是192.168.88.129 
        
        ifconfig


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201214112301.png)

  4. 打开HeidiSQL工具，点击新建，将上述的IP输入到主机名/IP，输入密码，点击打开 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201214112416.png)

  5. 如下图所示，实现了从Win10系统中远程连接CentOS系统下的数据库 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201214112528.png)

## 问题

**问题1：** ​ 使用yum命令安装包时，提示root权限不够 **解决办法：**

  * 配置普通用户使用sudo命令获取root权限

  * 先登录root用户 
    
        su -


  * 再修改文件sudoers 
    
        vi /etc/sudoers


  * 输入i进入编辑模式，在 root ALL=(ALL) ALL 下面添加一行，按Esc退出编辑模式，输入:wq!保存文件并退出 
    
        username      ALL=(ALL)      ALL


  * 输入exit退出root用户

  * 在普通用户模式下，使用sudo yum install ……然后输入密码，即可完成安装

## 参考

> http://datawhale.club/t/topic/478

