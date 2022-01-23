---
title: Java学习之Java文件IO操作
date: 2020-12-15
permalink: /java-learning-file-ope.html
tags:
 - Java
categories:
 - Java
---



## 文件读写

### 文件与目录的管理

  1. 遍历目录下的文件，list和listFiles

### 字符流读写

  1. 写入字符串 
        
        package com.jiangsu.nanjing;

    import java.io.File;
    import java.io.FileWriter;
    import java.io.IOException;
    
    public class TestFile {
       private static String mPath = "./test.txt";
    
       public static void main(String[] args){
           writeFileWithTry();
       }
    
       private static void writeFileWithTry(){
           String str = "bairiyishanjin, huangheruhailiu.\n";
           File file = new File(mPath);
           try (FileWriter writer = new FileWriter(file)){
               writer.write(str);
           }catch (IOException e){
               e.printStackTrace();
           }
       }


​    
    }


​    

  2. 读字符串 
        
        private static void readFileSimple(){
           File file = new File(mPath);
           try (FileReader reader = new FileReader(file)){
               char[] temp = new char[(int) file.length()];//创建与文件大小等长的字符数组
               reader.read(temp);  //从文件读取数据到字节数组
               String content = new String(temp);
               System.out.println(content);
           }catch (IOException e){
               e.printStackTrace();
           }
        
       }


### 缓冲区读写

  1. FileWiter和FileReader读写的数据以字符为单位，写的时候每次都是直接写入文件

  2. BufferedWriter是先写入缓存，等到缓存写满了再讲缓存上的数据写入文件

  3. 使用缓存字符流写入文件 
        
           private static void writeBuffer(){
           String str1 = "bairiyishanjin";
           String str2 = "yuqiongqianlimu";
           File file = new File(mPath);
           try (Writer writer = new FileWriter(file);
                BufferedWriter bwriter = new BufferedWriter(writer);){
               bwriter.write(str1);
               bwriter.newLine();
               bwriter.write(str2);
           }catch (Exception e){
               e.printStackTrace();
           }
        
       }


  4. 使用缓存字符流读文件 
        
           private static void readBuffer(){
           File file = new File(mPath);
           try (Reader reader = new FileReader(file);
           BufferedReader breader = new BufferedReader(reader);){
               for (int i=1; ;i++){
                   String line = breader.readLine();
                   if (line == null){
                       break;
                   }
                   System.out.println(line);
               }
           }catch (Exception e){
               e.printStackTrace();
           }
       }


### 随机访问文件的读写

  1. 对大文件追加数据的操作，可使用专门的文件修改工具RandomAccessFile 
        
        private static void appendStr(){
           try (RandomAccessFile raf = new RandomAccessFile(mPath, "rw")){
               long length = raf.length();
               raf.seek(length);  //定位到指定长度的位置
               String str = "Hello World.";
               raf.write(str.getBytes());
           }catch (Exception e){
               e.printStackTrace();
           }
       }


## I/O输入输出流

基于字节流方式的文件输入输出处理

### 文件I/O字节流

  1. 文件字节流 
        1. 文件输出流：FileOutputStream，将数据写入文件
            2. 文件输入流：FileInputStream，从文件读取数据
  2. 写文件 
        
           private static void writeFile(){
           String str = "bairiyishanjin,huangheruhailiu.\nyuqiongqianlimu,gengshangyicenglou";
           try(FileOutputStream fos = new FileOutputStream(mPath)){
               fos.write(str.getBytes());
           }catch (Exception e){
               e.printStackTrace();
           }
       }


  3. 读文件 
        
           private static void readFile(){
           try (FileInputStream fis = new FileInputStream(mPath)){
               byte[] bytes = new byte[fis.available()];//available获得文件大小
               fis.read(bytes);
               String content = new String(bytes);
               System.out.println(content);
           }catch (Exception e){
               e.printStackTrace();
           }
       }


### 缓存I/O字节流

文件输出流FileOutputStream是直接写到磁盘，性能较低，所以便有了文件输出流的缓存兄弟

  1. 缓存输出流写文件 
        
           private static void writeBuffer(){
           String str = "bairiyishanjin.";
           try (FileOutputStream fos = new FileOutputStream(mPath);
           BufferedOutputStream bos = new BufferedOutputStream(fos)){
               bos.write(str.getBytes());
           }catch (Exception e){
               e.printStackTrace();
           }
       }


  2. 缓存输入流读文件 
        
           private static void readBuffer(){
           try (FileInputStream fis = new FileInputStream(mPath);
           BufferedInputStream bis = new BufferedInputStream(fis)){
               byte[] bytes = new byte[bis.available()];
               bis.read(bytes);
               String content = new String(bytes);
               System.out.println(content);
           }catch (Exception e){
               e.printStackTrace();
           }
       }


### 对象序列化

  1. 把程序运行中的内存数据临时保存到文件

  2. 序列化：内存对象转换成磁盘文件数据的过程

  3. 反序列化：把磁盘文件内容转成内存对象的过程

  4. 声明对象的来源类是可序列化的 
        
        package com.jiangsu.nanjing;

    import java.io.Serializable;
    
    public class UserInfo implements Serializable { //Serializable接口表示当前类支持序列化
       private String name;
       private String phone;
       private String password;
    }


  5. 对象输入输出流

  6. 将对象信息写入文件 
        
           private static void writeObject(){
           UserInfo user = new UserInfo();
           user.setName("wang wu");
           user.setPhone("15565151");
           user.setPassword("123456");
           try (FileOutputStream fos = new FileOutputStream(mPath);
           ObjectOutputStream oos = new ObjectOutputStream(fos)){
               oos.writeObject(user);
           }catch (Exception e){
               e.printStackTrace();
           }
       }


  7. 从文件读取对象信息 
        
           private static void readObject(){
           UserInfo user = new UserInfo();
           try (FileInputStream fos = new FileInputStream(mPath);
           ObjectInputStream ois = new ObjectInputStream(fos)){
               user = (UserInfo) ois.readObject();
           }catch (Exception e){
               e.printStackTrace();
           }
           System.out.println(user.getName());
       }


### I/O流处理简单的数据压缩

两个过程：

  * 压缩 - 写入
  * 读取 - 解压

## NIO文件编程

NIO：Non-Blocking IO 非阻塞的IO，传统的流式IO又被称作BIO，Blocking IO
阻塞和非阻塞就比如私家车和出租车，考虑下资源的配置

### 文件通道FileChannel

通道中数据允许双向流动，相当于集成了FileInputStream和FileOutputStream

### 字节缓存ByteBuffer

位于通道内部的存储空间 是内存中的字节数组与磁盘中的文件交互的中间件

### 文件通道的性能优势

复制文件，直接是字节缓存和磁盘之间的操作，不涉及内存，性能比较好

### 路径工具Paths和Files

路径组工具：Paths 路径工具：path 文件组工具：Paths walk方法：

  1. 遍历指定目录以及深度在5层之内的子目录 
        
           private static void getDir(){
           try {
               Path path = Paths.get(mPath);
               List<String> dirs = Files.walk(path, 5)
                       .filter(Files::isDirectory)  //只挑选目录
                       .map(it -> it.toString())  //获取目录的路径名称
                       .collect(Collectors.toList());  //返回清单格式
               System.out.println(dirs);
           }catch (Exception e){
               e.printStackTrace();
           }
       }


  2. 挑选出目录下所有的PNG图片 
        
           private static void selectPNG(){
           try {
               Path path = Paths.get(mPath);
               List<String> pngs = Files.walk(path, 5)
                       .filter(it -> it.toFile().isFile()).filter(it -> it.endsWith(".png"))
                       .map(it -> it.toString()).collect(Collectors.toList());
               System.out.println(pngs);
           }catch (Exception e){
               e.printStackTrace();
           }
       }

