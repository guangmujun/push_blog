---
title: Flask学习之8-1 用户认证：基础功能
date: 2021-03-17
permalink: /flask-learning-assert-user.html
tags:
 - Flask
categories:
 - Flask

---



# 8用户认证

## 8.1 前言

> 项目地址：https://gitee.com/guangmujun/micro-blog 个人网站：https://guangmujun.cn
> Flask Web学习：https://guangmujun.cn/archives/category/learning-note/flask-web
> MySQL学习：https://guangmujun.cn/archives/category/learning-note/mysql-note 参考：
>
>   * https://www.cnblogs.com/yeer-xuan/p/13488291.html
>   * https://stackoverflow.com/questions/61356834/wtforms-install-email-
> validator-for-email-validation-support
>

## 8.2 Flask的认证扩展

  * Flask-Login：管理已登录用户的用户会话
  * Werkzeug：计算密码散列值并进行核对
  * itsdangerous：生成并核对加密安全令牌

## 8.3 密码安全性

存储密码的散列值 【密码】与【密码散列值】是一对多的关系 **@property** python中的@property装饰器可以总结为两个作用：

  1. 让函数可以像普通变量一样使用
  2. 对要读取的数据进行预处理

**@ *.setter** python中的@*.setter装饰器可以总结为两个作用：

  1. 对要存入的数据进行预处理
  2. 设置可读属性(不可修改)

**注意** ：@ _.setter装饰器必须在@property装饰器的后面，且两个被修饰的函数的名称必须保持一致，_ 即为函数名称。
`app/models.py`


​    
    from werkzeug.security import generate_password_hash, check_password_hash
    
    class User(db.Model):
        __tablename__ = 'users'
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(64), unique=True, index=True)
        role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
        password_hash = db.Column(db.String(128))
    
        @property  # 修饰方法，让方法可以像属性一样被访问
        def password(self):  # 试图读取原来的密码时，密码的散列值不可读
            raise AttributeError('密码不可读！')
    
        @password.setter  # 使password属性在存入前进行预处理
        def password(self, password):
            self.password_hash = generate_password_hash(password)
    
        def verify_password(self, password):
            return check_password_hash(self.password_hash, password)
    
        def __repr__(self):
            return '<User %r>' % self.username


## 8.4 创建认证蓝本

不同的程序功能，使用不同的蓝本，这里定义auth蓝本 `app/auth/__init__.py`


​    
    from flask import Blueprint
    
    auth = Blueprint('auth', __name__)
    
    from . import view


​    

`app/auth/views.py`


​    
    from flask import render_template
    from . import auth
    
    @auth.route('/login')
    def login():
        return render_template('auth/login.html')


使用蓝本的route修饰器定义与认证相关的路由 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210317110403.png) `app/__init__.py`


​    
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')  # 使用url_prefix参数，蓝本中定义的所有路由都会加上指定的前缀


login路由对应的URI为`localhost:5000/auth/login`

## 8.5 使用Flask-Login认证用户

Flask-Login：管理用户认证系统中的认证状态，且不依赖特定的认证机制 安装：


​    
    conda install flask-login


### 8.5.1 准备用于登录的用户模型

Flask-Login要求实现的用户方法：

  * `is_authenticated`：用户是否已经登录
  * `is_activate`：是否允许用户登录
  * `is_anonymous`：是否是匿名用户
  * `get_id()`：分会用户的唯一标志符

Flask-Login提供了一个UserMixin类，包含上述方法的默认实现，故将User模型进行修改： `app/models.py`


​    
    from flask_login import UserMixin
    
    class User(UserMixin, db.Model):
        __tablename__ = 'users'
        id = db.Column(db.Integer, primary_key=True)
        email = db.Column(db.String(64), unique=True, index=True)
        username = db.Column(db.String(64), unique=True, index=True)
        role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
        password_hash = db.Column(db.String(128))


初始化Flask-Login `app/__init__.py`


​    
    from flask_login import LoginManager
    
    login_manager = LoginManager()
    login_manager.session_protection = 'strong'      # 设置防止用户会话被篡改的安全等级
    login_manager.login_view = 'auth.login'          # 设置登录页面的端点
    
     login_manager.init_app(app)


实现Flask-Login要求的回调函数 `app/models.py`


​    
    from . import login_manager
    
    @login_manager.user_loader  # 加载用户的回调函数
    def load_user(user_id):
        return User.query.get(int(user_id))


### 8.5.2 保护路由

保护路由只让认证用户访问 `app/auth/views.py`


​    
    from flask_login import login_user, logout_user, login_required
    
    @auth.route('/logout')
    @login_required
    def logout():
        logout_user()
        flash('当前登录已经注销！')
        return redirect(url_for('main.index'))


### 8.5.3 添加登录表单

`app/auth/forms.py`


​    
    from flask_wtf import FlaskForm
    from wtforms import StringField, PasswordField, BooleanField, SubmitField
    from wtforms.validators import Length, Email, DataRequired
    import email_validator
    
    class LoginForm(FlaskForm):
        email = StringField('邮箱', validators=(DataRequired(), Length(1, 64), Email()))
        password = PasswordField('密码', validators=[DataRequired()])
        remember_me = BooleanField('记住我')
        submit = SubmitField('登录')


定义登录页面使用的模块 `templates/auth/login.html`


​    
    {% extends "base.html" %}
    {% import "bootstrap/wtf.html" as wtf %}
    {% block title %}Flasky - Login{% endblock%}
    
    {% block page_content %}
    <div class="page-header">
        <h1>登录</h1>
    </div>
    <div class="col-md-4">
        {{ wtf.quick_form(form) }}
    </div>
    {% endblock %}


​    

使用Flask-Bootstrap提供的`wtf.quick_form()`宏渲染表单即可 基模板中加入登录和注销的链接
`app/templates/base.html`


​    
    <ul class="nav navbar-nav navbar-right">
        {% if current_user.is_authenticated %}
        <li><a href="{{ url_for('auth.logout') }}">注销</a> </li>
        {% else %}
        <li><a href="{{ url_for('auth.login') }}">登录</a></li>
        {% endif %}
    </ul>


用户登录时，显示注销，用户注销后，显示登录

### 8.5.4 登入用户

`app/auth/views.py`


​    
    from flask import render_template, redirect, request, url_for, flash
    from flask_login import login_user, logout_user, login_required
    from . import auth
    from ..models import User
    from .forms import LoginForm
    
    @auth.route('/login', methods=['GET', 'POST'])
    def login():
        form = LoginForm()
        if form.validate_on_submit():
            user = User.query.filter_by(email=form.email.data).first()
            if user is not None and user.verify_password(form.password.data):
                login_user(user, form.remember_me.data)
                return redirect(request.args.get('next') or url_for('main.index'))
            flash('无效的用户名或者密码')
        return render_template('auth/login.html', form=form)


`login_user()`有两个参数：
第一个参数：要登录的用户，第二个参数：可选的“记住我”的布尔值，如果为True，会在用户浏览器中写入一个长期有效的cookies，使用这个cookies可以复现用户会话
根据“Post/重定向/Get模式”，此处点击提交登录的Post请求后，也做了重定向


​    
    redirect(request.args.get('next') or url_for('main.index'))


目标URL有两种可能：

  * 重定向到首页
  * 或是，用户访问未授权的URL时，会显示登录表单 
    * Flask-Login把原地址保存在查询字符串的next参数中
    * 这个参数可以从request.args字典中读取
    * 读取到则显示登录表单，没有读取到则显示首页

### 8.5.5 登出用户

`app/auth/views.py`


​    
    from flask_login import login_user, logout_user, login_required
    
    @auth.route('/logout')
    @login_required
    def logout():
        logout_user()
        flash('当前登录已经注销！')
        return redirect(url_for('main.index'))


### 8.5.6 测试登录

**更新首页** `templates/index.html`


​    
    {% block page_content %}
    <div class="page_content">
        <div class="page-header">
            <h1>你好, {% if current_user.is_authenticated %}{{ current_user.username }}{% else %}陌生人{% endif %}!</h1>
    
            {% if not known %}
            <p> 很高兴遇见你！</p>
            {% else %}
            <p> 欢迎回来！ </p>
            {% endif %}
    
        </div>
    
        {{ wtf.quick_form(form) }}
        <div class="page-bottom">
            <p>日期：{{ moment(current_time).format('LL') }}</p>
            <p>{{ moment(current_time).fromNow(refresh=True) }} 来过</p>
        </div>
    
    </div>
    {% endblock %}


**更新数据库** ！！！ 由于数据库中模型已经变更，需要先对数据库进行迁移和更新

  1. 创建迁移脚本


​    
    python hello.py db migrate -m "迁移信息"


  2. 更新数据库


​    
    python hello.py db upgrade


  3. 更新后的数据库效果 主要是users表的更新

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317152755.png)
**在shell中注册新用户** pycharm中设置运行参数为shell，运行


​    
    >>> u = User(email='john@163.com', username='john', password='cat')
    >>> db.session.add(u)
    >>> db.session.commit()


**操作效果**

  1. 直接打开 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317153003.png)

  2. 点击登录 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317153031.png)

  3. 输入在shell中注册的邮箱和密码，点击登录 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317153115.png) ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317153129.png)

  4. 点击注销 

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317153208.png)

