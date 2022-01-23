---
title: Java学习之Java容器与泛型
date: 2020-12-07
permalink: /java-learning-container.html
tags:
 - Java
categories:
 - Java
---



## 容器的种类

### 集合HashSet和TreeSet

  1. 每个事物都是唯一的

  2. Set属于接口，不能直接用来创建集合实例

  3. Set的两个实现类： 
        1. HashSet（哈希集合）：采取哈希表来存储数据
            2. TreeSet（二叉集合）：采取二叉树来存储数据
  4. 一开始使用集合，需要先创建该集合的实例 
        
        package com.jiangsu.nanjing;

    import java.util.HashSet;
    
    public class TestSet {
       public static void main(String[] args){
           testSet();
    
       }
    
       private static void testSet(){
           HashSet<String> set = new HashSet<String>();
           set.add("hello");
           set.add("world");
    
           System.out.println("set size:" + set.size());
       }
    }


​    

  5. for循环遍历 
        
               //for loop
           for (String hash_item : set){
               System.out.println("hash_item=" + hash_item);
           }


  6. 迭代器遍历 
        
        // iterator loop
           Iterator<String> iterator = set.iterator();
           while (iterator.hasNext()){
               String hash_iterator = (String) iterator.next();
               System.out.println("hash_iterator=" + hash_iterator);
           }


  7. forEach遍历 
        
        // forEach loop
           set.forEach(hash_each -> System.out.println("hash_each=" + hash_each));


  8. HashSet中元素是无序的，TreeSet中元素是有序的 
        
           private static void TestTreeSet(){
           TreeSet<String> set = new TreeSet<String>();
           set.add("hello");
           set.add("world");
           set.forEach(tree_each -> System.out.println("tree_each=" + tree_each));
       }


  9. 无论是哈希值计算，还是二叉节点比较，需要元素的归属数据类型提供计算方法或者比较方法，而对于开发者自己定义的数据类型，就要求开发者自己实现计算方法和比较方法

### 映射：HashMap和TreeMap

  1. 映射指的是两个实体之间存在一对一的关系

  2. 通过键值对来表达映射关系

  3. 创建实例时必须同时指定键名和键值的数据类型 
        
        HashMap<String, MobilePhone> map = new HashMap<String, MobilePhone>();
           map.put("Mate20", new MobilePhone("HuaWei", 600));
           map.put("Honor10", new MobilePhone("Honor", 4000));


  4. 迭代器遍历（显示指针） 
        
        // iterator loop

    Set<Map.Entry<String, MobilePhone>> entry_set = map.entrySet(); // 获得映射的集合入口
    Iterator<Map.Entry<String, MobilePhone>> iterator = entry_set.iterator();// 获得映射的迭代器
    while (iterator.hasNext()){
       Map.Entry<String, MobilePhone> iterator_item = iterator.next();
       String key = iterator_item.getKey();
       MobilePhone value = iterator_item.getValue();
       System.out.println(String.format("iterator_item key=%s, value=%s %d",
                                        key, value.getBrand(), value.getPrice()));
    }


  5. for循环遍历（隐式指针） 
        
        // for loop
           for (Map.Entry<String, MobilePhone> for_item : map.entrySet()){
               String key = for_item.getKey();
               MobilePhone value = for_item.getValue();
           }


  6. 通过键名集合遍历 
        
        // key and value loop

    Set<String> key_set = map.keySet();
    for (String key : key_set){
       MobilePhone value = map.get(key);
    }


  7. forEach遍历 
        
        // forEach loop

    map.forEach((key, value) ->
               System.out.println(String.format("each_item key=%s, value=%s %d",
                                                key, value.getBrand(), value.getPrice())));


### 清单：ArrayList和LinkedList

  1. 集合和映射中每个元素都是唯一的，清单中元素允许重复加入，并且根据加入的顺序先后罗列
  2. 清单的实现类 
        1. ArrayList：列表、动态数组
  3. Deque：队列，FIFO
  4. Stack：栈，FILO
  5. 链表LinkedList，双端列表：清单、队列和栈的融合体

## 泛型的规则

### 泛型在方法中的使用

  1. 应对参数类型不确定的需求

  2. 泛型：空泛的类型，不明确的类型，在方法定义或者类定义的时候不确定类型，等到使用的时候再指定

  3. 类型泛化的代码格式：`<T extends Object>`

  4. 由于Object是普通数据类型的基类，故上述格式可以简化为`<T>`

  5. 字符串拼接 
        
        public class TestClass {
       public static void main(String[] args){
           Double[] doubleArray = new Double[] {1.2, 2.3, 3.45553, 11.111};
           System.out.println(arraysToString(doubleArray));
       }
        
       public static <T> String arraysToString(T[] array){
           String result = "";
           if (array != null && array.length > 0){
               for (int i = 0; i < array.length; i++){
                   if (i > 0){
                       result = result + "|";
                   }
                   result = result + array[i].toString();
               }
           }
           return result;
       }

    }


### 泛型类定义及其运用

  1. 利用清单List来保存数据，获取数据中最长的元素和最短的元素


​    
    package com.jiangsu.nanjing;
    
    import java.util.List;
    
    //类名后面添加<T>，表示该类的内部代码中，所有的T类型都为外部需要时再制定类型
    public class  SimpleList<T> {
        private List<T> list;       //清单类型的数据类型为泛型T
    
        //构造方法，传入要保存的清单数据
        public SimpleList(List<T> list){
            this.list = list;
        }
    
        //获取当前清单数据
        public List<T> getData(){
            return this.list;
        }
    
        //返回的数据类型为泛型T
        public T getMaxLengthItem(){
            if (list == null || list.size() <= 0){
                return null;
            }
            T t = list.get(0);  //利用T声明一个泛型变量t
            for (int i = 0; i < list.size(); i++){
                if (list.get(i).toString().length() > t.toString().length()){
                    t = list.get(i);
                }
            }
            return t;
        }
    
        public T getMinLengthItem(){
            if (list == null || list.size() <= 0){
                return null;
            }
            T t = list.get(0);
            for (int i = 0; i < list.size(); i++){
                if (list.get(i).toString().length() < t.toString().length()){
                    t = list.get(i);
                }
            }
            return t;
        }
    }


​    
​    
    package com.jiangsu.nanjing;
    
    import java.util.Arrays;
    import java.util.List;
    
    public class TestClass {
        public static void main(String[] args){
            List<Double> doubleList = Arrays.asList(1.1, 2.2, 3.1415, 11.11);
            SimpleList<Double> simpleList = new SimpleList<Double>(doubleList);
            System.out.println(simpleList.getMaxLengthItem());
            System.out.println(simpleList.getMinLengthItem());
        }
    
    }


​    

### Java 8 新增的几种泛型接口

泛型存在某种不确定的类型，因此很少直接运用于泛型类，常以泛型接口的形式出现。 **断言接口Predicate**

  1. 用于匹配校验


​    
    package com.jiangsu.nanjing;
    
    import java.util.ArrayList;
    import java.util.Arrays;
    import java.util.List;
    import java.util.function.Predicate;
    
    public class TestClass {
        public static void main(String[] args){
            testPredicate();
        }
    
        //获取默认的苹果清单
        private static List<Apple> getAppleList(){
            List<Apple> appleList = Arrays.asList(
                    new Apple("RedApple", "RED", 150d, 10d),
                    new Apple("RigApple", "green", 250d, 10d),
                    new Apple("RedApple", "red", 300d, 10d),
                    new Apple("BigApple", "yellow", 200d, 10d)
            );
            return appleList;
        }
    
        //利用系统自带的断言接口， 过滤某个清单里的元素
        private static <T> List<T> filterByPredicate(List<T> list, Predicate<T> p){
            List<T> result = new ArrayList<T>();
            for (T t : list){
                if (p.test(t)){
                    result.add(t);
                }
            }
            return result;
        }
    
        //测试系统自带的断言接口
        private static void testPredicate(){
            List<Apple> appleList = getAppleList();
            List<Apple> redAppleList = filterByPredicate(appleList, Apple::isRedApple);
            System.out.println(redAppleList.toString());
            List<Apple> heavyAppleList = filterByPredicate(appleList,
                    t -> t.getWeight() >= 250);
            System.out.println(heavyAppleList.toString());
        }
    }


​    

**消费接口Consumer**

  1. 用于数据修改 
        
        private static void testConsumer(){
       List<Apple> appleList = getAppleList();
       //        modifyByConsumer(appleList, new Consumer<Apple>() {
       //            @Override
       //            public void accept(Apple apple) {
       //                apple.setName(apple.getName() + "Yummy");
       //            }
       //        });
       modifyByConsumer(appleList, t -> t.setName(t.getName() + "Yummy"));
       System.out.println(appleList.toString());

    }
    
    private static <T> void modifyByConsumer(List<T> list, Consumer<T> c){
       for (T t : list){
           c.accept(t);
       }
    }


  2. 联合使用断言接口和消费接口 
        
           private static void testPredicateAndConsumer(){
           List<Apple> appleList = getAppleList();
           selectAndModify(appleList, t -> t.isRedApple(),
                   t -> t.setPrice(t.getPrice() * 1.5));
           selectAndModify(appleList, t -> t.getWeight() >= 250,
                   t -> t.setPrice(t.getPrice() * 1.5));
           System.out.println(appleList.toString());
       }
        
       private static <T> void selectAndModify(List<T> list, Predicate<T> p,
                                               Consumer<T> c){
           for (T t : list){
               if (p.test(t)){
                   c.accept(t);
               }
           }
       }


**函数接口Function**

  1. 用于数据抽取

  2. 联合断言和消费接口的问题在于：破坏了原始数据，未抽取到新清单 
        
           private static void testFunction(){
           List<Apple> appleList = getAppleList();
           List<Apple> appleRecentList;
           appleRecentList = recycleByFunction(appleList,
                   new Function<Apple, Apple>() {
                       @Override
                       public Apple apply(Apple t) {
                           Apple apple = new Apple(t.getName(), t.getColor(),
                                   t.getWeight(), t.getPrice());
                           if (apple.isRedApple()){
                               apple.setPrice(apple.getPrice() * 1.5);
                           }
                           if (apple.getWeight() >= 250){
                               apple.setPrice(apple.getPrice() * 1.5);
                           }
                           return apple;
                       }
                   });
           System.out.println(appleRecentList.toString());
       }
        
       private static <T, R> List<R> recycleByFunction(List<T> list, Function<T, R> f){
           List<R> result = new ArrayList<R>();
           for (T t : list){
               R r = f.apply(t);
               result.add(r);
           }
           return result;
       }


## 容器的加工

### 容器与数组互转

  1. 容器转数组：出了映射Set之外，集合Set和清单List都支持通过toArray方法转化为数组
  2. 通过Arrays.asList得到的清单对象不能添加或删除元素

### 容器工具Collections

  1. 清单对应的容器工具 
        
        Collections.sort(appleList, (o1, o2) -> o1.getWeight().compareTo(o2.getWeight()))


  2. Collections的方法有：sort，min，max， fill， swap

### Java8新增的流式处理

  1. 由开发者事先定义一批处理命令，说明清楚每条指令的前因后果，然后启动流水线作业，即可得到最终的处理结果。

  2. 处理过程包含三个步骤

  3. 获得容器的流对象 
        1. 串行流：stream
            2. 并行流：parallelStream
  4. 设置流的各项筛选和加工指令 
        1. filter，sorted，map，limit，distinct
  5. 规划处理结果的展示形式 
        1. 包装流水线生产出来的数据
            2. count，forEach，collect
                3. 每次流水作业必须有且仅有一条结束指令
  6. 示例 
        
        public class TestStream {
       public static void main(String[] args){
           //按照名称统计红苹果的分组总价
           Map<String, Double> redPriceSum = getAppleList().stream()
                   .filter(Apple::isRedApple)
                   .collect(Collectors.groupingBy(Apple::getName, Collectors.summingDouble(Apple::getPrice)));
           System.out.println(redPriceSum);
        
       
           //按照名称统计红苹果的分组个数

    //        Map<String, Long> redStatisticCount = getAppleList().stream()
    //                .filter(Apple::isRedApple)
    //                .collect(Collectors.groupingBy(Apple::getName, Collectors.counting()));
    //        System.out.println(redStatisticCount);
    
           //挑选出去重后的苹果名称清单
    //        List<String> allNameList = getAppleList().stream()
    //                .map(Apple::getName)
    //                .distinct()
    //                .collect(Collectors.toList());
    //        System.out.println(allNameList);
    
           //挑选出红苹果清单，按苹果重量升序排列
    //        List<Apple> redAppleList = getAppleList().stream()
    //                .filter(Apple::isRedApple)
    //                .sorted(Comparator.comparing(Apple::getWeight))
    //                .limit(1)
    //                .distinct()
    //                .collect(Collectors.toList());
    //        System.out.println(redAppleList.toString());
    
           //对每个红苹果依次处理
    //        getAppleList().stream()
    //                .filter(Apple :: isRedApple)
    //                .forEach(s -> System.out.println(s.getColor()));
    
           //统计出红苹果的总数
    //        long redCount = getAppleList().stream()
    //                .filter(Apple :: isRedApple)
    //                .count();
    //        System.out.println(redCount);
       }
    
       //获取默认的苹果清单
       private static List<Apple> getAppleList(){
           List<Apple> appleList = Arrays.asList(
                   new Apple("RedApple", "RED", 150d, 10d),
                   new Apple("RigApple", "green", 250d, 10d),
                   new Apple("RedApple", "red", 300d, 10d),
                   new Apple("BigApple", "yellow", 200d, 10d)
           );
           return appleList;
       }
    }

