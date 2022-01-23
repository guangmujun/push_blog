---
title: Ubuntu服务器上设置Jupyter开发环境
date: 2021-03-15
permalink: /linux-ubuntu-set-jupyter-env.html
tags:
 - Linux
 - Ubuntu
 - Jupyter
categories:
 - Linux

---




# Ubuntu服务器上设置Jupyter开发环境

  1. 服务器中安装conda环境

  2. conda中新建虚拟环境 
        
        conda create --name ensemble python=3.8


  3. 激活ensemble虚拟环境 
        
        conda activate ensemble


  4. 安装第三方库 
        
        conda install ipython

    conda install jupyter


  5. 生成密钥,输入python进入到python shell，输入以下两行代码，然后输入两次自己需要设置的密码，记录生成的密钥 
        
        from notebook.auth import passwd

    passwd()


  6. 退出python的shell，退出conda虚拟环境，配置jupyter 
        
        vim ~/.jupyter/jupyter_notebook_config.py


找到对应位置进行修改


        c.NotebookApp.ip = '*' 
    c.NotebookApp.password = u'sha:ce...刚才复制的那个密文'
    c.NotebookApp.port = 6666 
    c.NotebookApp.open_browser = False 


  7. 打开自己设置的端口，我这里自定义的是6666，默认是8888 
        
        sudo apt-get install iptables

    iptables -I INPUT -p tcp --dport 6666 -j ACCEPT
    iptables-save


端口持久化


        sudo apt-get install iptables-persistent
    sudo netfilter-persistent save
    sudo netfilter-persistent reload


  8. 激活虚拟环境，设置在后台运行jupyter notebook 
        
        conda activate ensemble

    nohup jupyter notebook &


  9. 浏览器中输入`服务器地址:端口号`，即可访问jupyter notebook ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210315170019.png)

> 参考:
>
>   * https://www.cnblogs.com/kxm87/p/9561054.html
>   * https://www.cnblogs.com/qiangzi0221/p/8933722.html
>

