---
title: Java学习之Java类的进阶用法
date: 2020-12-09
permalink: /java-learning-class-senior-useage.html
tags:
 - Java
categories:
 - Java
---



## 异常

### 常见的程序异常

  1. 数学运算异常 
        1. 除数为0
            2. BigDecimal显示无限小数
  2. 数组越界异常 
        1. 超过索引
  3. 字符串与日期格式异常 
        1. 数据类型不对应
  4. 空指针异常 
        1. 绝大多数类型都必须先给对象创建实例，然后才能访问该对象的各项成员属性和成员方法
  5. 类型转换异常 
        1. 原始数据与目标数据不匹配

### 内存溢出错误

  1. 程序运行时会申请两块内存空间,一块叫堆内存,一块叫栈内存
  2. 堆内存 
        1. 承包了程序运行所需的大部分存储需求
  3. 栈内存 
        1. 负责保管每次方法调用的现场数据
  4. 所以内存溢出问题,要么是堆内存溢出,要么是栈内存溢出。

### 异常的处理：扔出与捕捉

  1. 扔出，throws
  2. 捕捉，try catch finally 
        1. 可以自定义异常类
            2. catch可以写多个
                3. catch（Exception e）表示捕捉任何属于Exception类型的异常

### 预防异常的产生

  1. 加校验

  2. 使用Optional规避空指针异常 
        1. 先调用`ofNullable`方法设置对象实例
            2. 再调用`map`方法转换数据类型
                3. 接着调用`orElse`方法设置空指针时的取值
    
        public boolean isRedApple(){
       boolean isRed = Optional.ofNullable(this.color)
           .map(color -> color.toLowerCase())
           .orElse('null')
           .equals('red');
       return isRed;

    }


## 反射

  1. 利用反射可以操作私有属性以及私有方法

  2. 获得实例的Class对象的方法有 
        1. `类名.class`
            2. `实例名.getClass()`
  3. 上述操作的反向操作：提供一个保存完整类名的字符串，即可由该字符串生成目标类的Class对象 
        1. `Class.forName(“完整类名”)`
  4. 反射：通过字符串反向获得Class对象的操作

  5. 利用反射技术操作私有属性 
        
        private static void setReflectSex(Chicken chicken, int sex){
       try{
           Class cls = Chicken.class;
           Field sexField = cls.getDeclaredField("sex");//通过字段名称获取该类的字段对象
           if (sexField != null){
               sexField.setAccessible(true);//设置该字段为允许访问
               sexField.setInt(chicken, sex);//将某实例的该字段修改为指定数值
           }
       }catch(Exception e){
           e.printStackTrace();
       }

    }


  6. 利用反射技术操作私有方法 
        1. 由于方法的输入输出可能存在不同，反射技术需要支持4中情况 
      1. 有输入参数
      2. 无输入参数
      3. 有输出参数
      4. 无输出参数
        2. 无输入参数、有输出参数的实例
        
      
        private static String getReflectName(Chicken chicken){
       String name = "";
       try{
           Class cls = Chicken.class;
           Method method = cls.getDeclaredMethod("getName");//通过方法名称和参数列表获取该方法的method对象
           method.setAccessible(true);//将方法设置为允许访问
           name = (String) method.invoke(chicken);//调用某实例的方法并获得输出参数
       }catch(Exception e){
           e.printStackTrace();
       }
       return name;

    }


    3. 有输入参数、无输出参数的实例
    
        private static void setReflectName(Chicken chicken, String name){
       try{
          Class cls = Chicken.calss;
          Method method = cls.getDeclaredMethod("setName", String.class);//通过方法名称和参数列表获取方法的Method对象
           method.setAccessible(true);
           method.invoke(chicken, name);//携带输入参数调用某实例的方法
       }catch(Exception e){
           e.printStackTrace();
       }
    }


## 注解

  1. 系统自带的5种注解 
        1. @Override 重写
            2. @Deprecated 不赞成、已废弃
                3. @SuppressWarnings 屏蔽警告
                    4. @FunctionalInterface 函数式接口
                        5. @SafeVarargs 兼容可变参数中的泛型参数
  2. 4种元注解 
        1. @Documented 表示他修饰的注解将被收录到Java的开发文档中
            2. @Target 表示他修饰的注解将作用于哪一类的代码实体
                3. @Retention 表示他修饰的注解将被编译器保留至哪个阶段
                    4. @Inherited 表示他修饰的注解将允许被子类继承
  3. 注解带有解释说明的含义，但注解是给编译器看的，编译器扫描到注解时，回去检查是否有问题

  4. 元注解的作用是给新定义的注解添加修饰，表明新注解能干什么……

  5. 利用注解技术检查空指针 
        1. 自定义新的非空注解 
       
                @Documented
        @Target({ElementType.FIELD})
        @Retention(RetentionPolicy.RUNTIME)
        public @interface NotNull{}
       

        2. 给非空字段添加非空注解 
            
                public class Apple{
          @NotNull
          private String name;
          @NotNull
          private String color;
        }
       

        3. 利用发射机制校验被费控注解修饰了的所有字段 
            
                public class NullCheck{
          public static boolean isValid(Object obj){
              if (obj == null){
                  System.out.println("校验对象为空");
                  return false;
              }
              Class cls = obj.getClass();
              List<String> invalidList = new ArrayList<String>();//申明一个字符串清单
              try{
                  Field[] fileds = cls.getDeclaredFields();//获得对象的所有属性
                  for (Field field : fields){
                      if (filed.isAnnotationPresent(NotNull.class)){//如果该属性申明了NotNUll注解，就校验空字段
                          if (filed != null){
                              field.setAccessible(true);
                              Object value = field.get(obj);//获取某实例的字段值
                              if (value == null){
                                  invaliedList.add(field.getName());//将该字段的名称添加到无效清单中
                              }
                          }
                      }
                  }
              }catch(Exception e){
                  e.printStackTrace();
              }
              if(invalidList.size() > 0){
                  String desc = String.format("%s类非空校验不通过的字段有：%s", cls.getName(), invalidList.toString());
                  System.out.prinln(desc);
                  return false;
              }else{
                  return true;
              }
          }
        }
       

        4. 在业务需要的地方调用校验方法 
            
                private static void getRedAppleByForWithNullCheck(List<Apple> list){
          List<Apple> redAppleList = new ArrayList<Appple>();
          if (list != null){
              for (Apple item : list){
                  if (NullCheck.isValid(item)){
                      if (item.isRedApple()){
                          redAppleList.add(item);
                      }
                  }
              }
          }
          System.out.println(redAppleList.toString());
        }
       

