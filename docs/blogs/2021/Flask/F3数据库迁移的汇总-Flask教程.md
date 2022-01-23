---
title: Flask学习之F3 数据库迁移的汇总
date: 2021-03-24
permalink: /flask-learning-database-migrate.html
tags:
 - Flask
 - 数据库
categories:
 - Flask
---



# F3数据库迁移的汇总

Flask-Migrate 数据库迁移还是很好用的，建议了解下~ 问题一： 一次数据库的误操作，导致，数据库连接成功，但是操作users表时，电脑卡死
解决办法： 打开数据库的客户端，查看目前的进程，把所有进程全部kill掉


​    
    -- 查看数据库系统进程
    show full processlist;
    -- 杀掉进程（杀掉卡住的进程）
    kill 'thread id';


​    

然后重启MySQL


​    
    service mysql restart


> 参考：
>
>   *
> https://blog.csdn.net/scdncby/article/details/108617130?utm_medium=distribute.pc_relevant.none-
> task-blog-
> BlogCommendFromMachineLearnPai2-1.control&dist_request_id=&depth_1-utm_source=distribute.pc_relevant.none-
> task-blog-BlogCommendFromMachineLearnPai2-1.control
>

问题二： 当时在处理问题一时，不小心，直接把users表删除了，怎么恢复？ 解决办法： 进入到shell


​    
    db.create_all()


如果不行，将迁移的版本回退到最初始的版本


​    
    db downgrade 版本号


> 参考：
>
>   * https://blog.csdn.net/qq_39147299/article/details/109498464
>

问题三： 创建迁移脚本时，提示`ERROR [root] Error: Target database is not up to date。`，使用了`db
upgrade`也不行 解决办法：

  1. 先使用`db history`，看看迁移的版本，以及目前head所在位置的版本号
  2. 查看数据库中的`alembic_version`表中的`version_num`的版本号，替换成步骤1中的版本号
  3. 然后创建迁移脚本，可正常使用

> 参考：
>
>   * https://blog.csdn.net/qq_43193386/article/details/99959841
>

