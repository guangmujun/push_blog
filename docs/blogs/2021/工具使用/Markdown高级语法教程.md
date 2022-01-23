---
title: Markdown高级语法教程
date: 2020-03-25
permalink: /tool-use-markdown-senior-program-use.html
tags:
 - 工具
 - Markdown
categories:
 - 工具
---



## 1 创建代办事项

语法：


​    
    - [ ] 课题组工作
        - [ ] 工作1
        - [ ] 工作2
    - [ ] 课程作业
    - [ ] 更新博文
    - [x] 打游戏
    - [x] 看剧


效果：

![](https://img-blog.csdnimg.cn/20200325145708622.png)

## 2 绘制流程图

### 2.1 Mermaid横向流程图

语法：


​    
        ```mermaid
        graph LR
        A[长方形] -- 链接 --> B((圆))
        A --> C(圆角长方形)
        B --> D{菱形}
        C --> D
        ```


效果：

![](https://img-blog.csdnimg.cn/20200325150130571.png)

### 2.2 Flowchart纵向流程图

语法：


​    
        ```mermaid
        flowchat
        st=>start: 开始
        e=>end: 结束
        op=>operation: 我的操作
        cond=>condition: 确认？
    
        st->op->cond
        cond(yes)->e
        cond(no)->op
        ```


效果：

![](https://img-blog.csdnimg.cn/20200325150138994.png)

## 3 其他图表

### 3.1 UML图

语法：


​    
        ```mermaid
        sequenceDiagram
        张三 ->> 李四: 你好！李四, 最近怎么样?
        李四-->>王五: 你最近怎么样，王五？
        李四--x 张三: 我很好，谢谢!
        李四-x 王五: 我很好，谢谢!
        Note right of 王五: 李四想了很长时间, 文字太长了  
    不适合放在一行.
    
        李四-->>张三: 打量着王五...
        张三->>王五: 很好... 王五, 你怎么样?
        ```


效果：

![](https://img-blog.csdnimg.cn/20200325150842835.png)

