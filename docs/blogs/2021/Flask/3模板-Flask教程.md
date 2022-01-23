---
title: Flask学习之3模板
date: 2021-03-11
permalink: /flask-learning-html-jinjia2.html
tags:
 - Flask
categories:
 - Flask
---



# 3 模板

为什么会有模板：

  * 分离业务逻辑和表现逻辑
  * 业务逻辑主要体现在视图函数处理事件上
  * 表现逻辑主要体现在将处理后的结果展示出来

**模板** ：一个包含响应文本的文件，用占位变量表示动态部分。 **渲染** ：使用真实值替换变量，再返回最终得到的响应字符串的过程。
为了渲染模板，Flask使用了一个名为 **Jinja2** 的强大模板引擎。

## 3.1 Jinjia2模板引擎

**渲染模板** 模板默认存放在Flask程序文件夹的templates目录中， templates/index.html：


   ```html
    <h1>Hello, Flask!</h1>
   ```




修改视图函数以渲染模板： 使用render_template函数把Jinjia2模板引擎集成到程序中


 ```python
    from flask import render_template
     @app.route('/')
     def index():
         return render_template('index.html')
 ```




**变量** 可使用类似{{ name }}结构表示变量 在渲染模板时，模板引擎从使用的数据中获取这个变量值
Jinjia2能识别出所有类型的变量：列表、字典、对象等 用 **过滤器** 修改变量，如以首字母大写形式显示变量name的值


    ```html
    Hello, {{ name|capitalize }}
    ```




部分常用过滤器：

  * `title`：将每个单词的首字母转化为大写
  * `lower`：全部字母转化为小写（upper大写)
  * `trim`：去掉值的首尾空格
  * `safe`：渲染值时不转义

**控制结构**

  1. 条件控制


```html
    {% if user %}
    {% else %}
    {% endif %}
```




  2. 循环控制


```html
    <ul>
        {% for comment in comments %}
        <li>{{ comment }}</li>
        {% endfor %}
    </ul>
```




  3. 宏（函数）


 ```html
    {% macro render_comment(comment) %}
         <li>{{ comment }}</li>
     {% endmacro %}
 ```

​    

    <ul>
        {% for comment in comments %}
            {{ render_comment(comment) }}
        {% endfor %}
    </ul>


 导入宏


 ```html
    {% import 'macros.html' as macros %}
 ```

​    

    <ul>
        {% for comment in comments %}
            {{ macros.render_comment(comment) }}
        {% endfor %}
    </ul>


  4. 模板继承 重复使用代码的强大方式，先定义基模板，然后其他相关模板继承此基模板

  * `extends`：声明模板继承自哪里

  * 在模板中可以重新定义块的内容

  * 当重新定义的块，其内容在基模板中不为空时，需要使用`super()`来获取原来的内容

    
    
    ```html
    {% extends "base.html" %}
    
    {% block title %}Flasky{% endblock %}
    
    {% block page_content %}
        <h1>Hello, {{ name|title }}!</h1>
    {% endblock %}
    ```
    
    

## 3.2 Flask-Bootstrap

Bootstrap是Twitter开发的一个开源框架（https://getbootstrap.com） 其提供的用户界面组件可用于创建简洁美观的网页

  1. 安装Flask扩展


  ```shell
    conda install flask-bootstrap
  ```




  2. 初始化


    ```shell
    from flask_bootstrap import Bootstrap
        bootstrap = Bootstrap(app)
    ```




  3. 定义基模板 Flask-Bootstrap中的基模板提供了一个网页框架，引入了Bootstrap中的左右CSS和JavaScript文件


​    
    {% extends "bootstrap/base.html" %}
    {% block title %}Flasky{% endblock %}
    
    {% block navbar %}
    <div class="navbar navbar-inverse" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="/">Flasky</a>
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li><a href="/">Home</a> </li>
                </ul>
            </div>
        </div>
    </div>
    {% endblock %}
    
    {% block content %}
    <div class="container">
        {% block page_content %}{% endblock %}
    </div>
    {% endblock %}


  4. 定义其他模板 index.html 
     
        

    {% extends "base.html" %}
    {% block title %}Flasky{% endblock %}
    
    {% block page_content %}
    <div class="page_content">
       <h1>Hello, Flask!</h1>
    </div>
    {% endblock %}


usr.html


        {% extends "base.html" %}
    
    {% block title %}Flasky{% endblock %}
    
    {% block page_content %}
    <div class="page_content">
       <h1>Hello, {{ name|title }}!</h1>
    </div>
    {% endblock %}


404.html


        {% extends "base.html" %}
    
    {% block title %}Flasky - Page Not Found{% endblock %}
    
    {% block page_content %}
    <div class="page_content">
       <h1>Not Found</h1>
    </div>
    {% endblock %}


  5. 修改视图函数


  ```python
    @app.route('/')
      def index():
          return render_template('index.html')
  
  
      
      @app.route('/usr/<name>')
      def usr(name):
          return render_template('usr.html', name=name)
  
  
      
      @app.errorhandler(404)
      def page_not_found(e):
          return render_template('404.html')
  ```




## 3.4 链接

`url_for()`函数

  * 输入：视图函数名称
  * 输出：视图函数对应的URL
  * 可选参数：`_extennal=True`表示返回绝对路径
  * 动态参数：通过关键字传入`url_for('user', name='join')`

## 3.5 静态文件

静态文件存放在程序根目录下的`static`文件夹中 URL映射中有一个static路由，`/static/<filename>`，是对静态文件的引用
使用`url_for('static', filename='favicon.ico'`即可获得图标的URL **定义收藏夹以及标签页的图标**
`favicon.ico`存放在`static`目录下 templates/base.html


```html
    {% block head %}
        {{ super() }}
        <link rel="shorcut icon" href="{{ url_for('static', filename='favicon.ico') }}" type="image/x-icon">
        <link rel="icon" href="{{ url_for('static', filename='favicon.ico') }}" type="image/x-icon">
        <title>{% block title %}{% endblock %}</title>
    {% endblock %}
```




## 3.6 Flask-Moment本地化日期和时间

全世界统一的时间单位，UTC，协调世界时 不习惯UTC格式，所以需要格式的本地化操作 Flask-
Moment能将moment.js集成到Jinjia2模板中，在浏览器中渲染日期和时间

  1. 安装


 ```shell
    conda install flask-moment
 ```




  2. 初始化


  ```python
    from flask_moment import Moment
      moment = Moment(app)
  ```




​    

  3. 修改基模板 

    * 向已有内容中添加新内容，需使用`super()`
    * `moment.lang('zh-cn')`指定语言的格式为中文，默认是英文


​    

  ```html
    {% block content %}
      <div class="container">
          {% block page_content %}{% endblock %}
          {% block scripts %}
          {{ super() }}
          {{ moment.include_moment() }}
          {{ moment.lang('zh-cn') }}
          {% endblock %}
      </div>
      {% endblock %}
  ```




  4. 修改其他模板 

    * `format('LLL')`渲染时间和日期，`LLLL`还会渲染出星期
    * `fromNow()`渲染出已经过去的时间描述，相关参考（https://moment.js/com/docs）


​    

​    

    {% extends "base.html" %}
    {% block title %}Flasky{% endblock %}
    
    {% block page_content %}
    <div class="page_content">
        <h1>Hello, Flask!</h1>
        <p>The local date and time is {{ moment(current_time).format('LLLL') }}</p>
        <p>That was {{ moment(current_time).fromNow(refresh=True) }}</p>
    </div>
    {% endblock %}


## 效果展示

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210311173143.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210311173212.png)

## 问题解决

问题1：


```shell
    jinja2.exceptions.TemplateSyntaxError: expected token 'end of statement block', got 'navbar'
```




解决：


```html
    {% extends "bootstrap/base.html" %}
```




少打了双引号 问题2：


 ```shell
    jinja2.exceptions.TemplateNotFound: bootstrap/base.html
 ```




解决：


   ```python
    from flask_bootstrap import Bootstrap
       bootstrap = Bootstrap(app)
   ```




没有初始化bootstrap

