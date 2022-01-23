---
title: Java学习之Java特殊的类
date: 2020-12-04
permalink: /java-learning-special-class.html
tags:
 - Java
categories:
 - Java

---



## 类的嵌套

  1. 内部类定义 
        
        public class Tree{
       // Flower类位于Tree类内部，是一个内部类

    public class Flower{  
    }
    }


  2. 内部类调用 
        
        // 先创建外部实例

    Tree tree = new Tree();
    // 根据外部实例，创建内部类的实例
    Tree.Flower flower = tree.new.Flower();


  3. 嵌套类定义 
        1. 静态的内部类：在内部类的前面添加关键字`static`
    
        public class TreeNest{
       public static class Flower{
           // 嵌套类与外层类的关系，比一般的内部类要弱
       }

    }


  4. 嵌套类调用 
        1. 直接创建嵌套类的实例
    
        TreeNest.Flower flower = new TreeNest.Flower(); 


  5. 静态：关键字`static`的用法 
        1. 可以修饰类、成员方法、成员属性
            2. 如`Math.round`等就是静态的方法，外部可直接通过“类名.静态方法名”进行访问
                3. 静态属性：取值固定不变
                    4. 静态方法：只允许操作输入参数
    
        public static int TYPE_ARBOR = 1;

    public static String getTypeName(int type){
    
    }


​    
        TreeStatic.TYPE_ARBOR;
    TreeStatic.getTypeName(TreeStatic.TYPE_ARBOR);


    5. `static`修饰代码块：静态代码块的执行时机先于该类的构造方法
    
        static{
    
    }


    6. `final static`表示该属性是允许赋值一次
    
        public final static int FINAL_TYPE_ARBOR = 1;


  6. 枚举类型标准定义 
        1. 枚举：某些同类型常量的有限集合
    
        public enum Season{
       SPRING, SUMMER, AUTUMN, WINTER

    }


​    
        private static void testEnum(){
       Season spring = Season.SPRING;
       System.out.println("序号：" + spring.ordinal() + "名称：" + spring.toString());
    }


    2. 枚举类型的通用方法：`ordinal`获取枚举的序号，`toString`获取枚举的字段名称
  7. 枚举类型的自定义 
        1. 枚举类型enum源自类class，因此枚举允许定义自己的成员属性、方法和构造方法
    
        public enum SeasonCn{
       SPRING(1, "春天"), SUMMER(2, "夏天"), AUTUMN(3, "秋天"), WINTER(4, "冬天");
        
       private int value;
       private String name;
        
       private SeasonCn(int value, String name){
           this.value = value;
           this.name = name;
       }
        
       public int getValue(){
           return this.value;
       }
        
       public String getName(){
           return this.name;
       }

    }


​    
        private static void testEnum(){
       SeasonCn spring = SeasonCn.SPRING;
       System.out.println("序号：" + spring.getValue() + "名称：" + spring.getName());
    }


## 类的抽象

> 如果只有部分方法为抽象方法，那么这是一个抽象类， 如果全部方法都为抽象方法，那么这是一个借口。

  1. 抽象类 
        1. 关键字`abstract`来标识抽象方法和抽象类
            2. 抽象方法，由于方法的具体实现不明确，因此没有花括号所包裹着的方法体
                3. 抽象类，不允许外部创建抽象类的实例
    
        package com.jiangsu.nanjing;

    abstract public class Chicken {
       public String name;
       public int sex;
    
       // 定义一个抽象的叫唤方法
       abstract public void call();
    
       public Chicken(){
    
       }
    }


​    
        package com.jiangsu.nanjing;
    
    public class Cock extends Chicken {
       public Cock(){
           sex = 0;
       }
    
       public void call(){
           System.out.println("喔喔喔");
       }
    }


​    
​    
        package com.jiangsu.nanjing;
    
    public class TestAbstract {
       public static void main(String[] args){
           Cock cock = new Cock();
           cock.call();
       }
    
    }


​    

  2. 简单接口 
        1. 与类平级，通过关键字`interface`标识
            2. 接口不允许定义构造方法，只用于声明某些行为
                3. Java8之前，接口内部的所有方法必须是抽象方法
                    4. 接口内部的属性，默认是终态属性
                        5. 子类不能继承多个父类，但某个类可以实现多个接口
    
        package com.jiangsu.nanjing;

    public interface Behavior {
       // 接口内部都是抽象方法，abstract关键字可省略
       public void fly();
       public void swim();
       public void run();
    
       public String TAG = "动物世界";
    }


​    
​    
        package com.jiangsu.nanjing;
    
    public class Goose extends Bird implements Behavior {
       public Goose(String name, int sexType, String voice){
           super(name, sexType, voice);
       }
    
       public void fly(){
           System.out.println("1");
       }
    
       public void swim(){
           System.out.println("2");
       }
    
       public void run(){
           System.out.println("3");
       }
    }


​    
​    
        package com.jiangsu.nanjing;
    
    public class TestInterface {
       public static void main(String[] args){
           testSimple();
       }
    
       private static void testSimple(){
           Goose goose = new Goose("鹅", 0, "鹅鹅鹅");
           goose.fly();
           goose.swim();
           goose.run();
       }
    }


  3. Java8之后的扩展接口 
        1. 增加了默认方法，通过前缀`default`来标识，实现类可直接继承并使用该方法，但不允许重写该方法
            2. 增加了静态属性和静态方法，通过前缀`static`来标识 
      1. 静态属性即终态属性
      2. 静态方法支持重写，但不能被继承，只能通过扩展接口自身访问
  4. 匿名内部类 
        1. 本质上属于内部类，没有名字,方便，无需额外定义专门的内部类 
       
                new 接口名称(){
             // 抽象方法
        }
       
       
                package com.jiangsu.nanjing;
       
        import java.util.Arrays;
        import java.util.Comparator;
       
        public class TestInterface {
          public static void main(String[] args){
              sortIntArrayDescAnonymous();
          }
       
          private static void sortIntArrayDescAnonymous(){
              Integer[] intArray = {89, 3, 67, 12, 45};
              Arrays.sort(intArray, new Comparator<Integer>() {
                  @Override
                  public int compare(Integer o1, Integer o2) {
                      return Integer.compare(o2, o1);
                  }
              });
              String descDesc = "intArray采取匿名内部类的降序结果为：";
              for (Integer item : intArray){
                  descDesc = descDesc + item + ",";
              }
              System.out.println(descDesc);
          }
       
        }
       

## 函数式编程

> 函数编程本质上是吧函数作为方法的输入参数， Java并未规定函数或方法是一种数据类型，因此需要借助接口来表达函数参数。

  1. Lambda表达式 
        1. 对匿名内部类的优化
    
        package com.jiangsu.nanjing;

    import java.util.Arrays;
    import java.util.Comparator;
    
    public class TestInterface {
       public static void main(String[] args){
           sortIntArrayDescAnonymous();
       }
    
       private static void sortIntArrayDescAnonymous(){
           Integer[] intArray = {89, 3, 67, 12, 45};
           Arrays.sort(intArray, (o1, o2) -> Integer.compare(o2, o1));  //lambda表达式
           String descDesc = "intArray采取匿名内部类的降序结果为：";
           for (Integer item : intArray){
               descDesc = descDesc + item + ",";
           }
           System.out.println(descDesc);
       }
    
    }


  2. 函数式接口的定义 
        1. 拥有一般接口的形态，但其内部有且仅有一个抽象方法
            2. Java不支持把方法作为参数类型，只好给方法加一层接口的包装
    
        package com.jiangsu.nanjing;

    public interface Behavior {
       public void act();
    }


​    
​    
        package com.jiangsu.nanjing;
    
    public class Animal {
       private String name;
    
       public Animal(String name){
           this.name = name;
       }
    
       public String getName(){
           return this.name;
       }
    
       public void midnight(Behavior behavior){
           behavior.act();
       }
    }


​    
​    
        package com.jiangsu.nanjing;
    
    public class TestAbstract {
       public static void main(String[] args){
           testCock();
       }
    
       private static void testCock(){
           Animal cock = new Animal("公鸡");
           cock.midnight((() -> System.out.println(cock.getName()+"在叫"))); //匿名内部类改写成lambda表达式
       }
    
    }


​    

  3. 双冒号标记的方法引用 
        1. 方法引用，只要符合一定的规则，即可将方法名称作为输入参数传进去

            2. 变量类型和方法名称之间用双冒号隔开

                3. 像`isEmpty`这种一元操作可以直接应用方法引用 
       
                resultArray = StringUtil.select(strArray, String::isEmpty);
       

        4. 像`contains，startsWith`这种就需要额外的操作 
            
                package com.jiangsu.suzhou;
       
        public interface StringFilter2 {
          public boolean isMatch(String str, String sign);
       
        }
       
        
       
                  public static String[] select2(String[] originArray, StringFilter2 filter2, String sign){
              int count = 0;
              String[] resultArray = new String[0];  //新建并初始化
              for (String str : originArray){
                  if (filter2.isMatch(str, sign)){
                      count++;
                      resultArray = Arrays.copyOf(resultArray, count);  // 数组容量增大一个
                      resultArray[count-1] = str;                       // 向数组末尾填入刚才找到的字符串
                  }
              }
            
              return resultArray;
          }
       
       
                private static void testSelect2(){
          String[] strArray = {"Hello", "World", "What", "is", "The", "Weather", "today", "o"};
          String[] resultArray;
          resultArray = StringUtil.select2(strArray, String::contains, "e");
       
          for (String str : resultArray){
              System.out.println(str);
          }
        }
       

        5. 更复杂的条件判断就使用正则匹配方法`matches`
            
                resultArray = StringUtil.select2(strArray, String::matches, "[wW][a-zA-Z]*");
       
  4. 静态方法引用和实例方法引用 
        1. 参数方法引用 
      1. 前述
        2. 静态方法引用 
          
                package com.jiangsu.suzhou;
      
        public interface Calculator {
          public double operate(double x, double y);
        }
      
        
      
                package com.jiangsu.suzhou;
      
        public class Arithmetic {
          public static double calculate(Calculator calculator, double x, double y){
              return calculator.operate(x, y);
          }
        }
      
        
      
                  private static void testStatic(){
              double result;
        //        result = Arithmetic.calculate((x, y) -> Math.max(x, y), 3, 2);
              result = Arithmetic.calculate(Math::max, 3, 2);
          }
      

        3. 实例方法引用 
            
                package com.jiangsu.suzhou;
      
        public interface Calculator {
          public double operate(double x, double y);
        }
      
        
      
                package com.jiangsu.suzhou;
      
        public class Arithmetic {
          public static double calculate(Calculator calculator, double x, double y){
              return calculator.operate(x, y);
          }
        }
      
        
      
                package com.jiangsu.suzhou;
      
        public class MathUtil {
          public double add(double x, double y){
              return x + y;
          }
      
          public double minus(double x, double y){
              return x - y;
          }
            
          public double mutiply(double x, double y){
              return x * y;
          }
            
          public double divide(double x, double y){
              return x / y;
          }
        }
      
        
      
                private static void testInstance(){
              MathUtil math = new MathUtil();
              double result;
              result = Arithmetic.calculate(math::add, 3, 2);
              result = Arithmetic.calculate(math::minus, 3, 2);
              result = Arithmetic.calculate(math::mutiply, 3, 2);
              result = Arithmetic.calculate(math::divide, 3, 2);
          }
      

