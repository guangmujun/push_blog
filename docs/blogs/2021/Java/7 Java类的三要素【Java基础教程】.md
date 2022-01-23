---
title: Java学习之Java类的三要素
date: 2020-11-28
permalink: /java-learning-three-element.html
tags:
 - Java
categories:
 - Java
---



  * 封装：用于包装数据属性和动作方法
  * 继承：用于派生并扩展已有类型
  * 多态：用于父类和子类之间类型转换与类型检查

## 类的封装

类：既包含数据又包含动作的结构体

  * 成员属性：保存数据
  * 成员方法：表达动作
  * 构造方法：初始化操作

  1. 类的成员定义 
        1. 机器语言
            2. 汇编语言（低级语言）：归纳常见操作
                3. C语言（中级语言）：把基本数据类型分门别类
                    4. C++（高级语言）：提供了全新的类class意图代替结构体struct
                        5. Java（高级语言）：保留面向对象的精髓，去掉了繁琐的指针操作
    
        // 演示类的封装，对成员属性和成员方法的定义

    package com.jiangsu.nanjing;
    
    public class OrangeMember {
       private String name;
       private double weight;
       private boolean isRipe;
       private String place;
    
       public void setPlace(String place){
           this.place = place;
           this.name = (this.place.equals("淮北"))?"枳子":"橘子";
       }
    
       public String getPlace(){
           return this.place;
       }
    
       public void setName(String name){
           this.name = name;
       }
    
       public String getName(){
           return this.name;
       }
    
       public void setWeight(double weight){
           this.weight = weight;
       }
    
       public double getWeight(){
           return this.weight;
       }
    
       public void setRipe(boolean isRipe){
           this.isRipe = isRipe;
       }
    
       public boolean getRipe(){
           return this.isRipe;
       }
    
       public String toString(){
           String desc = String.format("这个%s的重量是%s克，%s成熟，产地是%s。",
                   this.name, this.weight, this.isRipe?"已":"未", this.place);
           return desc;
       }
    }


​    
​    
        //调用实例的成员进行操作
    package com.jiangsu.nanjing;
    
    public class Test7 {
       public static void main(String[] args){
           testMember();
       }
    
       private static void testMember(){
           OrangeMember orange = new OrangeMember();
           orange.setName("橘子");
           orange.setPlace("淮南");
           orange.setRipe(true);
           orange.setWeight(200);
           System.out.println(orange.toString());
       }
    
    }


​    

  2. 类的构造方法 类名称的后面为什么能够直接跟着圆括号？ 
        
        OrangeMember orange = new OrangeMember();


因为类型的定义，除了成员属性和成员方法外，还有一种构造方法，其用途是构建并返回该类的实例，而且Java在编译时通常会自动补上默认的构造方法，如下：


        public OrangeMember (){
    
    }


 构造方法也可以自行定义，如：


        public orangeConstruct(String inputplace){
       palce = inputPlace;
       name = (place.equals("淮北"))?"枳子":"橘子"
    }
    
    private static void testConstruct(){
       OrangeConstruct orange = new OrangeConstruct("淮北");
    }


  3. this关键字的用法 用于指代当前类自身，通常用来修改成员属性，也可以修饰成员方法（类内部调用成员方法通常不嫁关键字this），举例： 
        
        private double weight;

    public void setWeight(double weight){
       this.weight = weight;
    }


## 类的继承

  1. 类的简单继承 
        1. 定义小类时不必另起炉灶，完全可以基于大类然后修修补补形成新的小类定义

            2. 这种小类基于大类的关系在面向对象的体系中被称作“继承”

                3. 大类叫做【基类】，基于大类的小类叫做【派生类】

                    4. Java中表示继承关系的关键字是`extends`

                        5. `class B extends A`表示A类派生出B类，即B类继承了A类 
       
                public class Swallow extends Bird{
       
        }
       
  2. 关键字`super`的用法 
        1. `super`关键字可在子类中引用父类的成员

            2. 派生类只继承基类的默认构造方法，没有自动继承带参数的构造方法 
       
                public class Eagle extends Bird{
             public Eagle(String name, int sexType, String voice){
              super(name, sexType, voice);
             }
        }
       

        3. `super`指代父类的名称，`super(name, sexType, voice);`表示`Bird(name, sexType, voice);`
        
        4. `super`表示父类，`this`表示本类
        
        5. 若想对父类的属性直接赋值，则考虑把父类的属性从`private`改为`public`
        
        6. Java对于同名属性的判断优先级有如下规则：

    * 若方法内部存在同名的输入参数，则该字段名称默认代表输入参数
    * 若方法内部不存在同名的输入参数，则该字段名称默认代表本类的成员属性
    * 若方法内部不存在同名的输入参数，且本类也未定义同名的成员属性，则该字段名称只能代表父类的成员属性
  3. 几种开放性修饰符 
        1. public：公共的，允许所有人访问
            2. private：私有的，只有自身可以访问
                3. protected：收保护的，允许本家族访问，包括自身及其子类
                    4. 无修饰符：友好的，允许当地人访问，对同一个包下面的类很友好
  4. 继承的示例 
        
        // 基类

    package com.jiangsu.nanjing;
    
    public class Bird {
       private String name;
       private String voice;
       private int sexType;
       protected String sexName;
    
       public Bird(String name, int sexType, String voice){
           this.name = name;
           this.voice = voice;
           setSexType(sexType);
    
       }
    
       public void setName(String name){
           this.name = name;
       }
    
       public String getName(){
           return this.name;
       }
    
       public void setVoice(String voice){
           this.voice = voice;
       }
    
       public String getVoice(){
           return this.voice;
       }
    
       public void setSexType(int sexType){
           this.sexType = sexType;
           this.sexName = (sexType==0)?"雄":"雌";
       }
    
       public int getSexType(){
           return this.sexType;
       }
    
       public String getSexName(){
           return this.sexName;
       }
    
       public String toString(){
           String desc = String.format("这是一只%s%s，它会%3$s、%3$s地叫", this.sexName, this.name, this.voice);
           return desc;
       }
    }


​    
​    
        // 派生类
    package com.jiangsu.nanjing;
    
    public class DuckProtected extends Bird {
       public DuckProtected(String name, int sex){
           super(name, sex, "嘎嘎");  // 继承父类的构造方法
       }
       public void setSexType(int sexType){
           super.setSexType(sexType); // 继承父类的方法
           sexName = (sexType==0)?"公":"母"; // 重写该方法
       }
    }


​    
​    
        // 测试
    package com.jiangsu.nanjing;
    
    public class Test7 {
       public static void main(String[] args){
           testMember();
       }
    
       private static void testMember(){
    //        Bird pigeon = new Bird("鸽子", 1, "咕咕");
    //        System.out.println(pigeon.toString());
    
           DuckProtected duck = new DuckProtected("鸭子", 1);
           System.out.println(duck.toString());
       }
    
    }


​    

## 类的多态

  1. 多态发生场景 
        1. 多态：多种状态，多态的实现依赖于继承

            2. 引入多态的好处：只要某些类型都从同一个父类派生而来，就能在方法内部把它们当做同一种类型来处理，而无须区分具体的类型。

                3. 举例 
       
                public static void call(Chicken chicken){
             chicken.call();
        }
       
       
                call(new Cock());
        call(new Hen());
       
  2. 对象的类型检查 
        1. 通过类的属性字段来检查

            2. 通过实例类型来鉴别 
       
                chicken.getClass().equals(Cock.class)
       

        3. 使用关键字`instanceof`来鉴别实例类型 
            
                chicken instanceof Cock
       
  3. 终态：关键字`final`的用法 **维护某个实体的纯洁性，不允许外部肆意篡改该实体。**
        1. 一旦某个类被final修饰，则该类无法再派生出任何子类 
       
                final public class Chick(){
       
        }
       

        2. 一旦某个成员属性被final修饰，则该属性不能再次赋值 
            
                public final int MALE = 0;
       

        3. 一旦某个成员方法被final修饰，则该方法禁止被子类重写 
            
                public final boolean canSwim(){
          return false;
        }
       

## 娱乐一下

有一种职业叫做“小鸡性别鉴定师”，年薪高达4万英镑（折合人民币40万左右）

