---
title: Java学习之JavaFX速成教程-从零开始快速创建应用
date: 2020-12-17
permalink: /java-learning-javafx.html
tags:
 - Java
categories:
 - Java
---



## 前言

Java界面编程框架的发展： AWT -> Swing -> JavaFX Java 8、9和10的JDK均包含了JavaFX组件，而Java 11
及其以后版本的JDK都需要手工集成JavaFX。 这里以Java 11的环境为例，演示Linux系统下JavaFX界面编程的配置与学习。

## 初始配置

### 下载JavaFX开发包

这里下载的JavaFX版本为11，是LTS版本


​    
    wget https://download2.gluonhq.com/openjfx/11.0.2/openjfx-11.0.2_linux-x64_bin-sdk.zip


### 导入JavaFX开发包

  1. 先解压文件 
        
        unzip openjfx-11.0.2_linux-x64_bin-sdk.zip


  2. 记录解压后文件中lib文件夹的路径，我的路径为`/home/wyh/IdeaProjects/javafx-sdk-11.0.2/lib`

  3. 启动IDEA，先新建一个JavaFX项目，起个 项目名称 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216200306.png)

  4. 点击【File】-> 【Project Structure】，在弹出的窗口中点击【Libraries】-> 【+】，然后选择【Java】，在弹出的窗口中选择JavaFX文件的lib文件夹目录，然后【OK】-> 【OK】 -> 【OK】 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216200530.png) ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216200623.png)

### 增加JavaFX编译选项

  1. 点击【run】，选择【Edit Configurations】，弹出的窗口中，点击【Modify options】，选择【Add VM options】

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216200946.png)

  2. 在此处填入以下信息：`--module-path "/home/wyh/IdeaProjects/javafx-sdk-11.0.2/lib" --add-modules javafx.controls,javafx.fxml`，注意双引号内的替换成自己JavaFX的lib文件夹所在的路径，然后点击【OK】 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216201045.png)

  3. 此时打开Main.java文件，右击运行，弹出Hello World窗口，表示运行成功 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216201355.png)

  4. 如果出现以下提示，说明【Add VM options】这一步骤配置有问题，请再检查一遍


​    
    /usr/lib/jvm/jdk-11.0.9/bin/java -Djava.library.path=/home/wyh/IdeaProjects/javafx-sdk-11.0.2/lib -javaagent:/snap/intellij-idea-community/267/lib/idea_rt.jar=45635:/snap/intellij-idea-community/267/bin -Dfile.encoding=UTF-8 -classpath /home/wyh/IdeaProjects/javafx/out/production/javafx:/home/wyh/IdeaProjects/javafx-sdk-11.0.2/lib/src.zip:/home/wyh/IdeaProjects/javafx-sdk-11.0.2/lib/javafx-swt.jar:/home/wyh/IdeaProjects/javafx-sdk-11.0.2/lib/javafx.web.jar:/home/wyh/IdeaProjects/javafx-sdk-11.0.2/lib/javafx.base.jar:/home/wyh/IdeaProjects/javafx-sdk-11.0.2/lib/javafx.fxml.jar:/home/wyh/IdeaProjects/javafx-sdk-11.0.2/lib/javafx.media.jar:/home/wyh/IdeaProjects/javafx-sdk-11.0.2/lib/javafx.swing.jar:/home/wyh/IdeaProjects/javafx-sdk-11.0.2/lib/javafx.controls.jar:/home/wyh/IdeaProjects/javafx-sdk-11.0.2/lib/javafx.graphics.jar sample.Main
    错误: 缺少 JavaFX 运行时组件, 需要使用该组件来运行此应用程序


## 代码布局

传统的敲代码生成组件，控制组件这种

## FXML布局

通过可视化操作生成界面，然后代码编写控件绑定的事件

### 下载Scene Builder

从[官网](https://www.oracle.com/java/technologies/javafxscenebuilder-1x-archive-
downloads.html)下载对应的版本并解压（需要登录） ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20201216214741.png)

### IDEA配置Scene Builder

点击【File】，点击【Setting】，点击【Languages&Framework】，选择【JavaFX】,选择Scene
Builder解压的文件中的如图所示的JavaFXSceneBuilder2.0，然后点击【OK】，配置完成 ![](https://my-
imags.oss-cn-shanghai.aliyuncs.com/pic/20201216215021.png)

### 使用Scene Builder

打开fxml文件，右击选择【Open In
SceneBuilder】,就会弹出如下图所示的界面，可以像在Qt软件中一样，对控件进行拖拽布局等，相关的界面设计，大家在SceneBuilder中点点点尝试一下就明白了
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216215201.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216215318.png)

### 控件绑定事件

前述的工作已经可以完成对软件的设计，但是软件也只是有一个界面，却没有实际的功能，下面我们就来看看如何添加软件的功能。
首先，我们在新建一个JavaFX项目后，项目中自动生成了三个文件：

  * Main.java 项目入口文件，我们初始化以及运行项目就是在这里操作，不需要改动太多

  * Controller.java 为控件绑定事件的程序主要就是写在这里，即软件的功能实现代码主要写在这里

  * sample.fxml 基本不需要改动，在SceneBuilder中设计好界面保存后，此处的代码也会自动更新

这里我们准备实现以下这样的效果：

  * 设计一个登陆界面，如下图1所示，Username对应的输入框用来输入账号，Password对应的输入框用来输入密码，Login按钮用来模拟登陆的点击，Status以及一个空白的标签用来显示登陆的信息
  * 当我们输入账号和密码，点击Login后，效果如图2所示，在Login按钮下方显示一行用户的登陆信息

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216220230.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216220254.png)
**实现步骤：**

  1. 在SceneBuilder界面设计出如下图所示的界面，拖拽空间，简单布局即可 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216220910.png)

  2. 设置控件的fx:id，下图演示了将Login按钮的fx:id设置为btnLogin，这个名字是自己起的，同理，我这里将账号输入框的id设置为filedUser、密码输入框的id设置为fieldPassword，用于显示登陆信息的Label的id设置为labelResult，设置完成后可能会有警告提示，不用管，记得保存就好~ ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216221040.png)

  3. 这时候我们打开fxml，可以发现里面的内容已经更新，下图中红线标注的部分，就是控件和代码绑定的关键部分，首先我们在Controller.java中进行编程，其次，可以用控件对应的id在程序中对控件进行操作 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201216221458.png)

  4. Controller.java的内容如下 
        
        package sample;

    import javafx.fxml.Initializable;
    import javafx.scene.control.Button;
    import javafx.scene.control.Label;
    import javafx.scene.control.PasswordField;
    import javafx.scene.control.TextField;
    
    import java.net.URL;
    import java.util.ResourceBundle;
    
    public class Controller implements Initializable {
    
       public Button btnLogin;
       public Label labelResult;
       public TextField fieldUser;
       public PasswordField fieldPassword;
    
       public void initialize(URL location, ResourceBundle resources){
           btnLogin.setOnAction(e -> {
               String desc = String.format("Username: %s Password: %s Login Success", fieldUser.getText(), fieldPassword.getText());
               labelResult.setText(desc);
           });
       }
    }


  5. 在Main.java中右键运行即可实现上述效果，Main.java内容如下 
        
        package sample;

    import javafx.application.Application;
    import javafx.fxml.FXMLLoader;
    import javafx.scene.Parent;
    import javafx.scene.Scene;
    import javafx.stage.Stage;
    
    public class Main extends Application {
    
       @Override
       public void start(Stage primaryStage) throws Exception{
           Parent root = FXMLLoader.load(getClass().getResource("sample.fxml"));
           primaryStage.setTitle("Login");
           primaryStage.setScene(new Scene(root, 500, 275));//创建一个场景Scene
           primaryStage.show();
       }
    
       //启动JavaFX应用，然后跳转到start方法
       public static void main(String[] args) {
           launch(args);
       }
    }


​    

## 资源下载

  * [JavaFX 开发包下载](https://guangmujun.cn/archives/379)
  * [JavaFX SceneBuilder下载](https://guangmujun.cn/archives/381)

