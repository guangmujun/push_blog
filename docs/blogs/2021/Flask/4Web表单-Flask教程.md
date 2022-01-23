---
title: Flask学习之4 Web表单
date: 2021-03-12
permalink: /flask-learning-web-form.html
tags:
 - Flask
categories:
 - Flask
---



# 4Web表单

> 项目地址：https://gitee.com/guangmujun/micro-blog 个人网站：https://guangmujun.cn/

Flask-WTF扩展 安装：`conda install flask-wtf`

## 4.1 跨站请求伪造保护

跨站请求伪造（CSRF） Flask-WTF通过设置密钥实现CSRF保护


​    
    app.config['SECRET_KEY'] = 'your secret key'


`app.config`字典用来存储框架、扩展和程序本身的配置变量 **提醒**
：为了增强安全性，密钥不应该直接写入代码，而是要保存在环境变量中，后续补充~

## 4.2 表单类

hello.py


​    
    from flask_wtf import FlaskForm
    from wtforms import StringField, SubmitField
    from wtforms.validators import DataRequired
    
    class NameForm(FlaskForm):
        name = StringField('请输入你的名字：', validators=DataRequired())
        submit = SubmitField('提交')


字段

  * 字段定义为类变量，如StringField
  * 类变量的值，如name，即是StringField类的实例化对象
  * 类的构造函数，如StringField中有两个参数，第一个参数是把表单渲染成HTML时使用的标号；第二个参数validators指定一个由验证函数组成的列表
  * 常见字段： 
    * TextAreaField-多行文本
    * PasswordField-密码文本
    * HiddenField-隐藏文本
    * DateField-datetime.date格式的文本
    * IntegerField-整数文本
    * BooleanField-复选框
    * SelectField-下拉列表
    * FileField-文件上传

验证函数：

  * 验证字段中的输入是否满足规定的条件
  * 常见验证函数： 
    * Email-验证电子邮件地址
    * EqualTo-比较两个字段的值是否相等
    * DataRequired-确保字段中有数据

## 4.3 把表单渲染成HTML

index.html


​    
    {% extends "base.html" %}
    {% import "bootstrap/wtf.html" as wtf %}
    
    {% block title %}Flasky{% endblock %}
    
    {% block page_content %}
    <div class="page_content">
        <div class="page-header">
            <h1>你好, {% if name %}{{ name }}{% else %}陌生人{% endif %}!</h1>
        </div>
    
        {{ wtf.quick_form(form) }}
        <div class="page-bottom">
            <p>日期：{{ moment(current_time).format('LL') }}</p>
            <p>{{ moment(current_time).fromNow(refresh=True) }} 来过</p>
        </div>
    
    </div>
    {% endblock %}


## 4.4 视图函数中处理表单

视图函数`index()`：

  * 渲染表单
  * 接收表单中的数据
  * 【接收用户从表单中输入后提交的数据，然后在页面上显示】

## 4.5 重定向和用户会话

hello.py


​    
    from flask import session, redirect, url_for
    
    @app.route('/', methods=['GET', 'POST'])
    def index():
        form = NameForm()
        if form.validate_on_submit():
            session['name'] = form.name.data
            return redirect(url_for('index'))
        return render_template('index.html', form=form, name=session.get('name'),
                               current_time=datetime.utcnow())


提交POST请求后，重定向到URL（浏览器向重定向的目标URL发送GET请求）

  * `redirect()`函数用来生成HTTP重定向响应
  * 其参数是重定向的URL，通常通过`url_for()`函数来生成

用户会话（session）用于在多次请求之间存储数据

  * 默认情况下，用户会话保存在客户端cookies中，使用设置的SECRET_KEY进行加密签名
  * `session`是请求上下文中的变量，属于字典类型

## 4.6 Flash消息

Flask的核心特性，用于提示状态信息 举例：提交的名字和存储在session中的名字不同时，flash消息

  1. 修改视图函数


​    
    from flask import session, redirect, url_for, flash
    
    @app.route('/', methods=['GET', 'POST'])
    def index():
        form = NameForm()
        if form.validate_on_submit():
            old_name = session.get('name')
            if old_name is not None and old_name != form.name.data:
                flash("姓名已修改！")
            session['name'] = form.name.data
            return redirect(url_for('index'))
        return render_template('index.html', form=form, name=session.get('name'),
                               current_time=datetime.utcnow())


  2. 修改模板


​    
    {% block content %}
    <div class="container">
        {% for message in get_flashed_messages() %}
        <div class="alert alert-warning">
            <button type="button" class="close" data-dismiss="alert">×</button>
            {{ message }}
        </div>
        {% endfor %}
        {% block page_content %}{% endblock %}
        {% block scripts %}
        {{ super() }}
        {{ moment.include_moment() }}
        {{ moment.lang('zh-cn') }}
        {% endblock %}
    </div>
    {% endblock %}


## 4.7 效果展示

主页效果 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210312154954.png)
直接点击提交按钮效果 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210312155030.png) 文本框中输入空格后点击提交效果 ![](https://my-
imags.oss-cn-shanghai.aliyuncs.com/pic/20210312155101.png) 文本框中输入“广慕君”，点击提交后效果
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210312155126.png)

## 4.8 问题解决

**问题一：**


​    
    TypeError: 'DataRequired' object is not iterable


**解决：**


​    
    name = StringField('请输入你的名字：', validators=[DataRequired()])


`DataRequired()`是列表的元素，列表是可以迭代的

