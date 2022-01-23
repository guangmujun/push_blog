---
title: 环境配置之win10中Anaconda安装Tensorflow2.0并嵌入到Jupyer Notebook中（Python3.7）
date: 2020-04-20
permalink: /machine-learning-win10-Anaconda-Tensorflow2-Jupyer-Notebook.html
tags:
 - 机器学习
 - Conda
 - Tensorflow
 - JupyterNoteBook 
categories:
 - 机器学习
---

## 安装步骤

  1. 创建tensorflow环境，此处出问题的话，转到问题记录。 `conda create --name tensorflow2 python=3.7`
  2. 查看tensorflow环境是否安装成功，成功的话，激活环境 `conda info --envs` `conda activate tensorflow2`
  3. 在tensorflow环境下安装tensorflow2.0 `pip install tensorflow==2.0 -i https://pypi.tuna.tsinghua.edu.cn/simple`
  4. 查看tensorflow是否安装成功，python环境下输入下方命令，没有报错，则安装成功 `import tensorflow as tf`

## 配置Jupyter Notebook

**安装：** `conda install ipython` `conda install jupyter` **运行：** `jupyter notebook`

## 安装Keras

`pip install keras -i https://pypi.tuna.tsinghua.edu.cn/simple/`

## 整体使用步骤

`activate tensorflow2` `jupyter notebook`

## 说明

因为是新建的环境，所以用到一些第三方的库，还是需要安装的，比如安装pandas,sklearn等。 安装命令 `pip install pandas -i https://pypi.tuna.tsinghua.edu.cn/simple/` `pip install scikit-learn scipy
matplotlib- -i https://pypi.tuna.tsinghua.edu.cn/simple/`

## 问题记录

**问题1** ：创建环境时，出现CondaHTTPError？

 **原因** ：安装时使用默认源，导致安装失败 

**解决** ：
下面更换默认源为清华源的命令走一遍~ 

`conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/` 

`conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/`

 `conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/`

 `conda config --set show_channel_urls yes` 

**然后重点来了** ，找到C盘，Users目录下，打开你的用户名文件夹，
找到`.condarc`文件打开，将`default`和`conda-forge`两行删除， 保存后，重新打开Anaconda
Prompt，输入上述命令即可成功安装Tensorflow环境。 

**问题2** ：打开Jupyter Notebook后提示Keneral Error，打开一看，报错`ModuleNotFoundError: No module named 'win32api'` 

**原因** ：相关库没有安装
**解决** ： tensorflow环境下： `pip install pypiwin32 -i https://pypi.tuna.tsinghua.edu.cn/simple/` 重新启动后，OK

