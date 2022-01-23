---
title: Java学习之Java多线程编程
date: 2020-12-29
permalink: /java-learning-multi-thread.html
tags:
 - Java
categories:
 - Java
---



## 线程的调度

### 基本用法

  1. 线程与进程的区别，多线程的性价比要优于多进程

  2. 一个进程默认自带一个线程，这个默认线程被称作主线程

  3. 基本使用 
        
        package com.jiangsu.nanjing;

    public class TestThread {
       public static void main(String[] args){
           CountThread thread = new CountThread();
           thread.start();
       }
    
       private static class CountThread extends Thread{
           public void run(){
               for (int i=0; i<1000; i++){
                   PrintUtils.print(getName(), "Current Number:"+i);
               }
           }
       }
    }


​    
​    
        package com.jiangsu.nanjing;
    
    import java.text.SimpleDateFormat;
    import java.util.Date;
    
    public class PrintUtils {
       public static void print(String threadName, String event){
           SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss.SSS");
           String dateTime = sdf.format(new Date());
           String desc = String.format("%s %s %s", dateTime, threadName, event);
           System.out.println(desc);
       }
    }


​    

  4. 设置优先级 
        
          private static void testPriority(){
           CountThread thread1 = new CountThread();
           thread1.setPriority(1);
           thread1.start();
           CountThread thread2 = new CountThread();
           thread2.setPriority(9);  //数字越大，优先级越高
           thread2.start();
       }


  5. 中断机制 
        
           private static class PassiveInterruptThread extends Thread{
           public void run(){
               try {
                   for (int i=0; i<1000; i++){
                       PrintUtils.print(getName(), "Current Number:"+i);
                       Thread.sleep(10);
                   }
               }catch (InterruptedException e){
                   PrintUtils.print(getName(), "Interrupt");
               }
           }
       }


        //睡眠500毫秒后中断    
    private static void testPassiveInterrupt(){
           PassiveInterruptThread thread = new PassiveInterruptThread();
           thread.start();
           try {
               Thread.sleep(500);
           }catch (InterruptedException e){
               e.printStackTrace();
           }
           thread.interrupt();
       }


### 任务Runnable

使用函数式接口，不用每次都去单独定义专门的线程类。

  1. 常规写法 
        
        private static class FactorialTask implements Runnable{
           public void run(){
               int product = 1;
               for (int i=1; i<=10; i++){
                   product *= i;
               }
               PrintUtils.print(Thread.currentThread().getName(), "Result:"+product);
           }
       }


        public static void main(String[] args){
           FactorialTask task = new FactorialTask();
           new Thread(task).start();
       }


  2. 内部类的写法 
        
        public static void main(String[] args){
           new Thread(new Runnable() {
               @Override
               public void run() {
                   int product = 1;
                   for (int i=1; i<=10; i++){
                       product *= i;
                   }
                   PrintUtils.print(Thread.currentThread().getName(), "Result:"+product);
               }
           }).start();
       }


  3. Lambda表达式写法 
        
        public static void main(String[] args){
           new Thread(() -> {
               int product = 1;
               for (int i=1; i<=10; i++){
                   product *= i;
               }
               PrintUtils.print(Thread.currentThread().getName(), "Result:"+product);
           }).start();
       }


  4. 资源共享和分配 **单独定义的线程类无法处理共享的事务** 3个线程共同售卖100张票的示例： 
        
        public static void main(String[] args){
           Runnable seller = new Runnable() {
               private int ticketCount = 100;
               @Override
               public void run() {
                   while (ticketCount > 0){
                       ticketCount--;
                       String left = String.format("Left: %d", ticketCount);
                       PrintUtils.print(Thread.currentThread().getName(), left);
                   }
               }
           };
           new Thread(seller, "A").start();
           new Thread(seller, "B").start();
           new Thread(seller, "C").start();
       }


### 过程Callable

利用Callable接口构建任务代码，重写call方法，设置返回值。 创建一个线程，获取随机数示例：


​    
    Callable<Integer> callable = () -> new Random().nextInt(100);


结合Callable和FutureTask跟踪任务的执行状态


​    
    public static void main(String[] args){
            Callable<Integer> callable = () -> new Random().nextInt(100);
            FutureTask<Integer>  future = new FutureTask<Integer>(callable);
            new Thread(future).start();
            try {
                Integer result = future.get();
                PrintUtils.print(Thread.currentThread().getName(), "Main Thread:"+result);
            }catch (InterruptedException | ExecutionException e){
                e.printStackTrace();
            }
        }


### 定时器与定时任务

  * TimerTask：描述时刻到达后的事务处理

  * Timer：用于调度定时任务 
    * schedule：重载同名方法，下个任务在上个任务结束之后再间隔若干时间才启动
    * scheduleAtFixedRate：达到启动间隔即启动，下个任务不管上个任务何时结束

    
    
    private static class CountTask extends TimerTask{
            private int count = 0;
            public void run(){
                PrintUtils.print(Thread.currentThread().getName(), "Result:"+count);
                count++;
            }
        }
    
    
    
    private static void testScheduleOnce(){
            CountTask timerTask = new CountTask();
            Timer timer = new Timer();
    //        timer.schedule(timerTask, 5000);
            timer.schedule(timerTask, 5000, 1000);
            try {
                Thread.sleep(1000);
            }catch (InterruptedException e){
                e.printStackTrace();
            }
            timer.cancel();
        }
    

## 并发控制

### 同步：关键字synchronized的用法

解决线程冲突问题
可以修饰某个方法或者某个代码块，目的是限定该方法、代码块为同步方法/同步代码块，即规定同一时刻只能有一个线程执行同步方法，其他线程来了以后必须在旁边等待。


​    
    package com.jiangsu.nanjing;
    
    public class TestSync {
        public static void main(String[] args){
            testConflict();
        }
    
        private static void testConflict(){
            Runnable seller = new Runnable() {
                private Integer ticketCount = 100;
                @Override
                public void run() {
                    while (ticketCount > 0){
                        int count = getDecreaseCount();
                        String left = String.format("The left number is: %d", count);
                        PrintUtils.print(Thread.currentThread().getName(), left);
                    }
                }
                private  synchronized int getDecreaseCount(){
                    return --ticketCount;
                }
            };
            new Thread(seller, "A").start();
            new Thread(seller, "B").start();
            new Thread(seller, "C").start();
        }
    }


​    

### 通过加解锁避免资源冲突

线程同步机制只适用于简单场合。 锁机制，可重入锁ReentrantLock，可重入即支持重新进入，加锁不是为了锁自己，是为了锁别人。


​    
        private final static ReentrantLock reentrantLock = new ReentrantLock();
    
        private static void testReentranLock(){
            Runnable seller = new Runnable() {
                private Integer ticketCount = 100;
    
                @Override
                public void run() {
                    while (ticketCount > 0){
                        reentrantLock.lock();
                        int count = --ticketCount;
                        reentrantLock.unlock();
                        String left = String.format("The left number is: %d", count);
                        PrintUtils.print(Thread.currentThread().getName(), left);
                    }
                }
            };
            new Thread(seller, "A").start();
            new Thread(seller, "B").start();
            new Thread(seller, "C").start();
        }


锁可细分为：读锁和写锁，读锁与读锁不互斥，读锁与写锁互斥，写锁与写锁互斥。 可重入读写锁： ReentranReadWriteLock


​    
        private final static ReentrantReadWriteLock readWriteLock = new ReentrantReadWriteLock();
        private final static ReentrantReadWriteLock.WriteLock writeLock = readWriteLock.writeLock();
        private final static ReentrantReadWriteLock.ReadLock readLock = readWriteLock.readLock();
    
        private static void testReadWriteLock(){
            Runnable seller = new Runnable() {
                private Integer ticketCount = 100;
                @Override
                public void run() {
                    while (ticketCount > 0){
                        int count = 0;
                        try(FileOutputStream fos = new FileOutputStream("./test.txt")){
                            readLock.lock();
                            if (ticketCount <= 0){
                                fos.close();
                                readLock.unlock();
                                break;
                            }
                            readLock.unlock();
                            writeLock.lock();
                            count = --ticketCount;
                            writeLock.unlock();
                            fos.write(new String(""+count).getBytes());
                        }catch (Exception e){
                            e.printStackTrace();
                        }
                        String left = String.format("The left number is: %d", count);
                        PrintUtils.print(Thread.currentThread().getName(), left);
                    }
                }
            };
            new Thread(seller, "A").start();
            new Thread(seller, "B").start();
            new Thread(seller, "C").start();
        }


### 信号量Semaphore的请求与释放

加锁比同步灵活，但是在高级场合仍然不使用。 信号量的关键在于量，里面保存的是许可证，并且许可证的数量不止一个，意味着有几个许可证，就允许几个线程一起处理。
信号量支持多种请求许可证的方式，用于满足于丰富多样的业务需求，有：

  * 坚持请求向信号量申请许可证，及时收到线程中断信号也不放弃
  * 尝试向信号量申请许可证，但只愿意等待有限的时间
  * 尝试向信号量立即申请许可证，哪怕一丁点时间都不愿意等待
  * 尝试向信号量申请许可证，如果信号量无空闲许可证，那么愿意继续等待，但在等待期间允许接收中断信号

### 线程间的通信方式

同步、加锁、信号量只适用于同一资源的共享分配

  1. 同步机制下的线程通信 
        
           private static Integer salary = 5000;
        
       private static void testWaitNotify(){
           Runnable employee = new Runnable() {
               @Override
               public void run() {
                   PrintUtils.print(Thread.currentThread().getName(), "Wait for salary");
                   synchronized (salary){
                       try{
                           salary.wait();  //等待发工资
                           PrintUtils.print(Thread.currentThread().getName(), "Let's eat");
                       }catch (InterruptedException e){
                           e.printStackTrace();
                       }
                   }
               }
           };
        
           Runnable boss = new Runnable() {
               @Override
               public void run() {
                   wait_a_moment();
                   PrintUtils.print(Thread.currentThread().getName(), "Give salary");
                   synchronized (salary){
                       wait_a_moment();
                       salary.notify();//在等待的队列中随机挑选一个线程发放通知
                       PrintUtils.print(Thread.currentThread().getName(), "Done salary");
                   }
               }
           };
        
           new Thread(employee, "I'm employee").start();
           new Thread(boss, "I'm boss").start();
       }
        
       //模拟日常事物的时间消耗
       private static void wait_a_moment(){
           int delay = new Random().nextInt(500);
           try{
               Thread.sleep(delay);
           }catch (InterruptedException e){
               e.printStackTrace();
           }
       }


  2. 加锁机制下的线程通信 
        
        private final static ReentrantLock reentrantLock = new ReentrantLock();
       private static Condition condition = reentrantLock.newCondition();
        
       private static void testCondition(){
           Runnable employee = new Runnable() {
               @Override
               public void run() {
                   PrintUtils.print(Thread.currentThread().getName(), "Wait Salary");
                   reentrantLock.lock();
                   try{
                       condition.await();
                       PrintUtils.print(Thread.currentThread().getName(), "Eat");
                   }catch (InterruptedException e){
                       e.printStackTrace();
                   }
                   reentrantLock.unlock();
               }
           };
        
           Runnable boss = new Runnable() {
               @Override
               public void run() {
                   wait_a_moment();
                   PrintUtils.print(Thread.currentThread().getName(), "Give Salary");
                   reentrantLock.lock();
                   wait_a_moment();
                   condition.signal();
                   PrintUtils.print(Thread.currentThread().getName(), "Done salary");
                   reentrantLock.unlock();
               }
           };
        
           new Thread(employee, "I'm employee").start();
           new Thread(boss, "I'm boss").start();
       }


## 线程池管理

  * 普通线程池：执行实时任务
  * 定时器线程池：执行定时任务
  * 分治框架：Fork/Join

### 普通线程池

线程池封装了线程的创建、启动、关闭等操作，以及系统的资源分配与线程调度。 线程池的分类（按数量）：

  * 只有一个线程 
    
        private static void testSinglePool(){
          ExecutorService pool = (ExecutorService) Executors.newSingleThreadExecutor();
          for (int i=0; i<10; i++){
              Operation operation = new Operation("Single Pool", i);
              pool.execute(operation);
          }
          pool.shutdown();
      }
        
      private static class Operation implements Runnable{
          private String name;
          private int index;
        
          public Operation(String name, int index){
              this.name = name;
              this.index = index;
          }
        
          public void run(){
              String desc = String.format("%s do task %d", name, index+1);
              PrintUtils.print(Thread.currentThread().getName(), desc);
          }
      }


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201229114346.png)

  * 固定数量的线程 
    
        private static void testFixedPool(){
          ExecutorService pool = (ExecutorService) Executors.newFixedThreadPool(3);
          for (int i=0; i<10; i++){
              Operation operation = new Operation("Single Pool", i);
              pool.execute(operation);
          }
          pool.shutdown();
      }


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201229114421.png)

  * 有无限数量的线程 
    
        private static void testUnlimitPool(){
          ExecutorService pool = (ExecutorService) Executors.newCachedThreadPool();
          for (int i=0; i<10; i++){
              Operation operation = new Operation("Single Pool", i);
              pool.execute(operation);
          }
          pool.shutdown();
      }

​    

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201229114527.png)

  * 线程数量允许变化的线程池 
    
        private static void testCustomPool(){
      //最小线程个数为2，最大线程个数为5，每个线程保持活跃的时间为60，单位为秒，等待队列大小为19
          ThreadPoolExecutor pool = new ThreadPoolExecutor(2, 5, 60,
                  TimeUnit.SECONDS, new LinkedBlockingDeque<Runnable>(19));
          for (int i=0; i<10; i++){
              Operation operation = new Operation("Pool", i);
              pool.execute(operation);
          }
          pool.shutdown();
      }


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201229114817.png)

### 定时器线程池

要求在特定的时间点运行，并且不止运行以此，还要周期性地反复运行。 分类：

  * 单线程的定时器线程池 
    
        package com.jiangsu.nanjing;
        
    import java.util.concurrent.Executors;
    import java.util.concurrent.ScheduledExecutorService;
    import java.util.concurrent.TimeUnit;
    
    public class TestScheduled {
      public static void main(String[] args){
          testSingleScheduleOnce();
      }
    
      private static void testSingleScheduleOnce(){
          //创建延迟一次的单线程定时器
          ScheduledExecutorService pool = (ScheduledExecutorService) Executors.newSingleThreadScheduledExecutor();
          for (int i=0; i<5; i++){
              Visit visit = new Visit("delay", i);//创建一个参观任务
              pool.schedule(visit, 1, TimeUnit.SECONDS);//命令线程池调度任务，延迟1秒后执行参观任务
          }
      }
    
      private static class Visit implements Runnable{
          private String name;
          private int index;
          public Visit(String name, int index){
              this.name = name;
              this.index = index;
          }
    
          public void run(){
              String desc = String.format("%s do task %d", name, index);
              PrintUtils.print(Thread.currentThread().getName(), desc);
          }
      }
    }
    
    

  * 固定数量的定时器线程池 
    
        //固定速率
    private static void testMultiScheduleRate(){
      //固定数量，固定速率
          ScheduledExecutorService pool = (ScheduledExecutorService) Executors.newScheduledThreadPool(3);
          for (int i=0; i<5; i++){
              Visit visit = new Visit("specific rate", i);
              //第一次延迟1秒执行任务，以后每间隔3秒执行下一个任务
              pool.scheduleAtFixedRate(visit, 1, 3, TimeUnit.SECONDS);
          }
      }
    
    
        //固定延迟
    private static void testMultiScheduleDelay(){
          ScheduledExecutorService pool = (ScheduledExecutorService) Executors.newScheduledThreadPool(3);
          for (int i=0; i<5; i++){
              Visit visit = new Visit("delay rate", i);
              //每3秒执行下一个任务
              pool.scheduleWithFixedDelay(visit, 1, 3, TimeUnit.SECONDS);
          }
      }
    

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201229120330.png)

调度方式：

  * 定时任务只启动一次
  * 每间隔若干时间周期启动定时任务
  * 固定延迟若干时间启动定时任务

### 分治框架爱Fork/Join

线程池的内部线程之间没有什么关联，但是存在下级线程的任务由上级线程分配，而且下级线程的处理结果要交给上级线程汇总。

  * 从上往下分解任务，Fork
  * 最下面的基层线程操作具体的任务
  * 从下往上逐级汇总任务结果，Join

实例：计算0-100的和


​    
    //内部线程池
    package com.jiangsu.nanjing;
    
    public class TestForkJoinSum {
        public static void main(String[] aegs){
            testInternalTask();
        }
    
        private static void testInternalTask(){
            int[] arr = new int[100];
            for (int i=0; i<100; i++){
                arr[i] = i + 1;
            }
            SumTask task = new SumTask(arr, 0, arr.length);
            try {
                Integer result = task.invoke();
                System.out.println("The final result:"+result);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }


​    
​    
​    
    package com.jiangsu.nanjing;
    
    import java.util.concurrent.RecursiveTask;
    
    public class SumTask extends RecursiveTask<Integer> {
        private static final long serialVersionUID = 1L;
        private static final int THRESHOLD = 20;
        private int src[];
        private int start;
        private int end;
    
        public SumTask(int[] src, int start, int end){
            this.src = src;
            this.start = start;
            this.end = end;
        }
    
        private Integer subTotal(){
            Integer sum = 0;
            for (int i=start; i<end; i++){
                sum += src[i];
            }
    
            String desc = String.format("%s the result of (%d - %d) = %d",
                    Thread.currentThread().getName(), start, end, sum);
            System.out.println(desc);
            return sum;
        };
    
        protected Integer compute(){
            if ((end - start) <= THRESHOLD){
                return subTotal();
            }else {
                int middle = (start + end) / 2;
                SumTask left = new SumTask(src, start, middle);
                left.fork();
                SumTask right = new SumTask(src, middle, end);
                right.fork();
                int sum = left.join() + right.join();
                String desc = String.format("%s the result of (%d - %d) = %d",
                        Thread.currentThread().getName(), start, end, sum);
                System.out.println(desc);
                return sum;
            }
        }
    }


​    

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201229121644.png)
使用线程池工具ForkJoinPool，可设置开启的线程的数量，线程池内部进行统计


​    
    //外部显示指定ForkJoinPool
    private static void testPoolTask(){
            int[] arr = new int[100];
            for (int i=0; i<100; i++){
                arr[i] = i + 1;
            }
            SumTask task = new SumTask(arr, 0, arr.length);
            ForkJoinPool pool = new ForkJoinPool(6);
            ForkJoinTask<Integer> taskResult = pool.submit(task);
            try {
                Integer result = taskResult.get();
                System.out.println("The final result:"+result);
            }catch (Exception e){
                e.printStackTrace();
            }
            pool.shutdown();
        }


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201229122007.png)

