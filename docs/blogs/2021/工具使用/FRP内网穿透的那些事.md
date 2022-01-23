---
title: FRP内网穿透的那些事
date: 2021-03-18
permalink: /tool-use-frp-inter-network.html
tags:
 - 工具
 - FRP
categories:
 - 工具

---



# FRP内网穿透的那些事

## 需求

本地跑起了一些服务，希望处在外网的用户能够访问到本地的服务，
比如，在个人的电脑上开发了一个Web应用，此应用在本地可正常使用，我们希望外网的用户，通过访问某个链接，也能够正常使用我们运行在本地的Web应用，
所以，我们就需要做内网穿透这件事~

## 准备

  * 一台具有公网IP的服务器
  * 本地能够跑起来的服务

## 操作

  1. [github](https://github.com.cnpmjs.org/fatedier/frp/releases)下载对应系统版本的frp，我的客户端和服务端都是linux系统，所以都下载的`frp_0.36.0_linux_amd64.tar.gz`

  2. 在客户端和服务端分别将下载好的压缩包，解压到自定义的位置 
        1. frps开头的文件，主要用于服务端 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210318154321.png)

            2. frpc开头的文件，主要用于客户端 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210318154357.png)

  3. 服务端的配置，修改`frps.ini`，详细的配置可参考[官方中文文档](https://gofrp.org/docs/examples/)，此处演示对本地tcp协议的6666端口的映射，文件内容如下，默认即可 
        
        [common]

    bind_port = 7000


  4. 注意：服务器上的7000端口一定要开启，后续才能成功映射，[端口开启参考](https://guangmujun.cn/archives/447)

  5. 服务端启动 
        
        ./frps -c ./frps.ini


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210318155016.png)

  6. 客户端配置，修改`frpc.ini`，输入公网IP地址，添加[tcp6666]那一块，名字可自定义，type为tcp，local_ip为127.0.0.1，local_port为6666，remote_port可以自定义，也可以使用6666 
        
        [common]

    server_addr = 公网IP地址
    server_port = 7000
    
    [ssh]
    type = tcp
    local_ip = 127.0.0.1
    local_port = 22
    remote_port = 6000
    
    [tcp6666]
    type = tcp
    local_ip = 127.0.0.1
    local_port = 6666
    remote_port = 6666


  7. 客户端启动 
        
        ./frpc -c ./frpc.ini


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210318155623.png)

  8. 使用`公网IP：remote_port`即可通过外网访问到本地在6666端口运行的服务

  9. 后台运行 
        
        nohup ./frps -c ./frps.ini &


        nohup ./frpc -c ./frpc.ini &


> 参考：
>
>   * https://guangmujun.cn/archives/447
>
>   * https://www.mintimate.cn/2020/05/06/frp/
>
>   * https://github.com.cnpmjs.org/fatedier/frp
>
>   * https://gofrp.org/docs/setup/
>
>

