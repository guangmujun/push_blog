---
title: 实例讲解：使用Git最基础的功能【Git使用速查】
date: 2021-01-02
permalink: /tool-use-git-base-use.html
tags:
 - 工具
 - Git
categories:
 - 工具
---



![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102172010.png)

## 安装

windows系统直接从git官网下载安装，linux系统使用命令行安装。

## 实例一：创建本地仓库并提交到远程仓库中

  1. 演示准备 我这里新建了一个GitTest文件夹，里面新建一个test.txt，作为演示的项目文件。

  2. 右击GitTest文件夹，选择Git Bash Here ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102162334.png)

  3. 在git的窗口中输入git init ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102162550.png)

  4. 使用git add添加工作区文件到暂存区 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102162539.png)

  5. 使用git commit命令提交暂存区的文件到代码仓库 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102162659.png)

  6. 先用git config --list 查看是否在本地配置了用户名和邮箱，没有配置则使用`git config --global user.name your-name`和`git config --global user.email your-email`进行配置 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102162810.png)

  7. 以Gitee为例演示，Github同理，点击加号新建仓库，输入仓库名称，选择是否开源等，创建仓库，并复制仓库的HTTPS链接。

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102161317.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102161403.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102161442.png)

  8. 使用git push your-https master，将本地仓库提交到远程仓库，会弹出窗口让你输入你的Gitee的账号和密码 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102163122.png)

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102162148.png)

## 实例二：使用远程仓库实现团队合作

  1. 演示准备，新建一个UserB文件夹，并右击文件夹选择Git Bash Here打开一个Git的窗口，由此来模拟团队中的两个成员：成员A和成员B，此时成员A经过实例一已将本地仓库提交到远程仓库

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102163626.png)

  2. 【成员B】使用git init初始仓库 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102163950.png)
  3. 【成员B】使用git pull your-https master拉取远程仓库到本地的master分支，命令输入完成后，UserB的文件夹内便有了test.txt ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102164036.png)
  4. 【成员B】修改UserB文件夹中的test.txt，模拟成员B对项目内容的调整，修改完成后使用`git add`、`git commit`和`git push`将工作区的改动后的文件提交到远程代码库中，刷新远程仓库可以看到test.txt内容已经修改 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102164353.png) ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102164531.png) ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102164548.png) ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102172212.png) ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102165021.png)
  5. 【成员A】使用git pull命令拉取更新后的远程仓库，拉取完成后，GitTest中的test.txt则更新为UserB修改后的内容，由此实现基本的团队协作 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210102165656.png)

## 基本常用命令

  1. 初始化仓库 
        
        git init


  2. 将工作区文件添加到暂存区 
        
        git add filename  //添加工作区某个文件

    git add .         //添加工作区所有文件


  3. 将暂存区文件添加到版本库 
        
        git commit -m "commint description"

    git commit -am "commint description"  //直接将工作区所有已经跟踪的文件提交


  4. 查看指令 
        
        git log      //查看提交信息

    git status   //查看项目文件状态


  5. 配置指令 
        
        git config --global user.name your-name    //配置用户名

    git config --global user.email your-email  //配置邮箱
    git config --list                          //查看配置


## 撤销删除命令

  1. 撤销上一次提交并将暂存区的文件重新提交 
        
        git commit -amend


  2. 拉取暂存区的文件并将其替换工作区的文件 
        
        git checkout --filename


  3. 拉取最近一次提交的版本库中的文件到暂存区 
        
        git reset HEAD --filename


  4. 删除文件，删除文件后重新使用git add和git commit就好

## 分支相关命令

  1. 查看 
        
        git branch


  2. 创建 
        
        git branch branch-name


  3. 修改分支名称 
        
        git branch -m ole-name new-name


  4. 切换分支 
        
        git checkout branch-name


  5. 删除分支 
        
        git branch -D branch-name


  6. 合并 
        1. git diff 
      1. git diff：比较工作区与暂存区文件的差异
      2. git difff --staged：比较暂存区与版本库的文件差异
      3. git diff 版本号 版本号
      4. git diff 分支 分支
        2. git merge branch-name
  7. 储存变更 
        1. git stash：暂存工作区中的修改
            2. git stash list：暂存的修改列表
                3. git stash apply stash@{num}：将暂存区的内容拉取到工作区
                    4. git stash drop stash@{num}：删除暂存的信息

## 远程常用命令

  1. 本地仓库提交到远程仓库 
        
        git push your-https master  //提交到远程仓库的master分支


  2. 配置远程仓库名称 
        
        git remote add resp-name your-https  //将自定的名称和仓库地址对应

    git remote -v //查看已经配置的仓库名称
    git push resp-name master  //将本地仓库提交到resp-name对应的远程仓库


  3. 拉取远程仓库到本地 
        
        git pull your-https master


> 参考:https://study.163.com/course/courseMain.htm?courseId=1004094014

