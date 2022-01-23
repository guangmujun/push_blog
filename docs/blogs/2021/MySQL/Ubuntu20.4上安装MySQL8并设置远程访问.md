---
title: MySQL学习之Ubuntu20.4上安装MySQL8并设置远程访问
date: 2021-03-12
permalink: /mysql-learning-ubuntu-remote-ope.html
tags:
 - MySQL
 - Ubuntu 
categories:
 - MySQL

---



# Ubuntu20.4上安装MySQL8并设置远程访问

## 1 前言

想在本地的一台Ubuntu系统的主机上安装MySQL，并且在局域网内可以使用其他终端连接此数据库~
走了很多弯路，尝试了很多方法，亲测有效，建议详细看完一遍再动手操作！！！
本机Ubuntu20.4，安装的MySQL是8.0版本，此版本的MySQL安全性提高，远程访问配置有坑！

## 2 安装配置测试MySQL

### 2.1 安装


​    
    sudo apt-get update  
    sudo apt-get install mysql-server 


默认安装最新版本的MySQL

### 2.2 配置


​    
    sudo mysql_secure_installation


配置内容如下：【设置密码，N，N，N，Y】


​    
    #1
    VALIDATE PASSWORD PLUGIN can be used to test passwords...
    Press y|Y for Yes, any other key for No: N (选择N ,不会进行密码的强校验)
    
    #2
    Please set the password for root here...
    New password: (输入密码)
    Re-enter new password: (重复输入)
    
    #3
    By default, a MySQL installation has an anonymous user,
    allowing anyone to log into MySQL without having to have
    a user account created for them...
    Remove anonymous users? (Press y|Y for Yes, any other key for No) : N (选择N，不删除匿名用户)
    
    #4
    Normally, root should only be allowed to connect from
    'localhost'. This ensures that someone cannot guess at
    the root password from the network...
    Disallow root login remotely? (Press y|Y for Yes, any other key for No) : N (选择N，允许root远程连接)
    
    #5
    By default, MySQL comes with a database named 'test' that
    anyone can access...
    Remove test database and access to it? (Press y|Y for Yes, any other key for No) : N (选择N，不删除test数据库)
    
    #6
    Reloading the privilege tables will ensure that all changes
    made so far will take effect immediately.
    Reload privilege tables now? (Press y|Y for Yes, any other key for No) : Y (选择Y，修改权限立即生效)


​    

### 2.3 测试


​    
    systemctl status mysql.service


提示activate(running)即表示MySQL正常运行

## 3 配置远程访问

  1. 输入密码后进入到MySQL中


​    
    mysql -u root -p


  2. 切换到mysql数据库


​    
    use mysql;


  3. 查询相关数据


​    
    select host,user,plugin from user;


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210312195158.png)

  4. 将host改为%


​    
    update user set host = '%' where user = 'root';


  5. 刷新权限


​    
    FLUSH PRIVILEGES;


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210312195338.png)

  6. **更改连接的密码校验方式**


​    
    ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY'123456';


  7. 刷新权限


​    
    FLUSH PRIVILEGES;


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210312195508.png)

  8. exit退出MySQL，修改配置文件`vim /etc/mysql/mysql.conf.d`内容，注释以下两行，即这两行前面要有`#`号


​    
    # bind-address      = 127.0.0.1
    # mysqlx-bind-address   = 127.0.0.1


  9. 重新启动MySQL


​    
    service mysql restart


  10. **防火墙** 中开放3306端口


​    
    sudo ufw allow 3306
    sudo ufw status


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210312200025.png)

## 4 效果展示

MySQL Workbench和Navicat均连接成功 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210312200127.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210312200241.png)

## 5 坑的地方

只将root对应的host修改为%是没用的，

  * MySQL8的加密方式不同，安全性能提升了，需要修改
  * 修改host，修改加密方式等MySQL的操作进行之后，都要Flash刷新权限
  * 需要注释掉配置文件中的127.0.0.1字段，MySQL设置完成后要重新启动下服务
  * 还无法连接的话，或者说连接出现2003错误的，就来看看防火墙是否打开了3306端口

祝好~

## 参考

  * https://guangmujun.cn/archives/371
  * https://blog.csdn.net/weixin_38924500/article/details/106261971
  * https://blog.csdn.net/wd2014610/article/details/89023562

