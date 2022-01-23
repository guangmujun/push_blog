---
title: Pytorch安装之Win10安装GPU版本Pytorch的全面教程【避坑指南】
date: 2020-10-19
permalink: /machine-learning-pytorch-win10-gpu-problem.html
tags:
 - 机器学习
 - PyTorch
 - GPU 
categories:
 - 机器学习
---



## 踩坑记录，一定要看！

> 安装Pytorch对应的CUDA时，建议使用10.2或者10.1版本

笔者显卡对应的CUDA为11.0，但是从Pytorch官网上可以看到目前其最高支持的版本是10.2，所以在给自己的电脑配置GPU环境时，装个10.2版本的CUDA就好，总之两者一定要对应起来！！！

> 安装Pytorch时，如果删除掉 -c pytorch参数，会默认给您安排上cpu版本的Pytorch

此条命令一出，烦恼全无~

    conda install pytorch torchvision cudatoolkit=10.2 -c https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/


>
> 感慨一下，想要安装某些东西时，不要急着按照一个教程就去安装，真的，网上的教程鱼龙混杂，看个一两篇，有的时候真的不行，多对比几个安装教程，多搜索一下安装过程中可能会有哪些坑，能很大程度的提高您安装的成功率，节约您的时间成本，祝：一切顺利，安装成功！

## 配置GPU环境

_建议安装CUDA10.2!!!_

### 查看显卡的CUDA版本号

  1. 打开控制面板
  2. 点击NVIDIA控制面板
  3. 点击系统信息
  4. 点击组件
  5. 看到CUDA对版本为11.0.208

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201018141927.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201018142012.png)

### 安装CUDA

  1. 下载地址，[官网](https://developer.nvidia.com/cuda-11.0-update1-download-archive?target_os=Windows&target_arch=x86_64&target_version=10&target_type=exelocal)
  2. 选择对应的配置，点击下载即可

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201018142214.png)

  3. 以管理员身份运行exe，安装过程中，选择自定义安装选项，只勾选CUDA组件，其他选项默认即可

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201018144818.png)

### 安装cuDNN

  1. 登录[官网](https://developer.nvidia.com/rdp/cudnn-download)

  2. 下载对应CUDA版本的cuDNN

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201018142357.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201018142545.png)

  3. 下载完成后，将压缩包解压，将其中的bin目录添加到系统变量中 

    * 右击我的电脑
    * 选择高级系统设置
    * 在弹出的窗口中选择环境变量
    * 点击系统变量区域的新建按钮
    * 点击浏览目录，选择bin文件夹
    * 自己写个变量名，点击确定即可

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201018145613.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201018145536.png)
**补充：** 针对上述的第三步，也可不进行环境变量的配置，将压缩包中三个文件中的文件分别复制粘贴到CUDA安装目录下对应的文件夹中。

### 测试CUDA是否安装成功

打开conda窗口，输入`ncvv -V`，出现如下提示，则安装成功 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201018145902.png)

## 安装GPU版本的PyTorch

此处使用conda来进行安装

### 设置虚拟环境

  1. 在conda终端中输入如下命令，新建一个名称为pytorch的虚拟环境，环境中使用python3.7


​    
    conda create --name pytorch python=3.7


  2. 激活虚拟环境pytorch，在这个环境中进行pytorch的安装


​    
    conda activate pytorch


### 安装Pytorch

  1. 进入[官网](https://pytorch.org/get-started/locally/)
  2. 选择对应的配置后，复制图中红色矩形框中的命令

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201018143535.png)

> 提示：电脑上安装的CUDA版本的，一定要和Pytorch官网上的CUDA版本对应起来。

  3. 在激活的虚拟环境中，运行上述复制的命令，注意直接复制粘贴运行的话，安装过程会非常缓慢， **即使你已经配置使用国内的源** ，问题在于：此条命令中的`-c pytorch`又再一次指定了源，网上有的教程建议直接将`-c pytorch`删除， _但这是一个神坑！！！_ ，如果删除了，则默认会给您装上cpu版本的torch，如下图： ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201019152148.png) 使用`-c pytorch`安装非常慢，还会出错，不使用`-c pytorch`，虽然使用的是国内的源安装，但又会自动给您安排上cpu版本的torch，所以，怎么解决呢？笔者自己尝试出了一个小方法：使用下述命令 
    
            ```shell
            conda install pytorch torchvision cudatoolkit=10.2 -c https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/
            ```
        
        


意思就是指定源，但我们指定使用清华的源，安装的是GPU版本的torch，下载速度有很大的提升！

### 测试是否安装成功

  1. 查看自己的torch版本 打开conda安装的包的目录，简单看下刚刚安装的pytorch的名称，图中可以看到我们安装的pytorch的版本号是1.6.0，对应着python3.7，cuda10.2，cudnn7.0 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201019154241.png)

  2. 验证torch是否安装成功 
        
        `import torch`


没有报错，则安装成功

  3. 安装gpu版本的torch是否可用 
        
        `torch.cuda.is_available()`


输出True，则安装成功；输出False，则gpu版本安装失败 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201019154435.png)

## 遇到的问题

**问题一：** 输入命令后，安装Pytorch相关的包，下载速度非常慢，最终无法完成安装提示失败 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201018151405.png) **解决办法：**

  * `conda dactivate`退出当前环境
  * `conda remove -n your-env-name --all` 删除当前的环境
  * `conda create --name your-env-name python=3.7`重新创建一个环境
  * `conda install pytorch torchvision cudatoolkit=10.2 -c https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/`在新环境中输入复制的命令，指定使用清华的源，

**问题二：** CUDA和Pytorch安装好了后，输入`torch.cuda.is_available()`仍然为`False` **原因分析：**

  1. CUDA没有配置好
  2. 安装的torch是cpu版本的

**解决办法：**

  1. 重新配置CUDA

卸载CUDA11.0，重新安装CUDA10.2，然后再安装对应版本的Pytorch 卸载CUDA的步骤：

  * 打开控制面板
  * 选择程序和功能
  * 按时间排序，删除那天你安装的所有NVIDIA和CUDA相关的文件

  2. 重新安装Pytorch 一定要指定国内的源来安装Pytorch，一方面速度快，能安装成功；另一方面，不会默认给你安装cpu版本的Pytorch 
        
        `conda install pytorch torchvision cudatoolkit=10.2 -c https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/`


折腾了大半天，给我点个赞吧~:astonished:

