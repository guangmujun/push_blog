---
title: Flask学习之10用户资料
date: 2021-03-24
permalink: /flask-learning-user-profile.html
tags:
 - Flask
categories:
 - Flask
---



# 10用户资料

## 10.1 前言

> 项目地址：https://gitee.com/guangmujun/micro-blog 个人网站：https://guangmujun.cn
> Flask Web学习：https://guangmujun.cn/archives/category/learning-note/flask-web
> MySQL学习：https://guangmujun.cn/archives/category/learning-note/mysql-note 参考：
>
>   * https://sb.sb/blog/css-cdn/
>

## 10.2 资料信息

`app/models.py`用户信息字段


​    
​    class User(UserMixin, db.Model):
​        __tablename__ = 'users'
​        id = db.Column(db.Integer, primary_key=True)                                # id
​        email = db.Column(db.String(64), unique=True, index=True)                   # 邮箱
​        username = db.Column(db.String(64), unique=True, index=True)                # 用户名
​        role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))                  # 角色id
​        password_hash = db.Column(db.String(128))                                   # 密码的哈希值
​        confirmed = db.Column(db.Boolean, default=False)                            # 是否验证
​        name = db.Column(db.String(64))                                             # 姓名
​        location = db.Column(db.String(64))                                         # 位置
​        about_me = db.Column(db.Text())                                             # 自我介绍
​        member_since = db.Column(db.DateTime(), default=datetime.utcnow)            # 注册日期
​        last_seen = db.Column(db.DateTime(), default=datetime.utcnow)               # 最后访问日期
​        avatar_hash = db.Column(db.String(32))                                      # 头像URL中用到的hash值


`datetime.utcnow`后面没有`()`，因为`db.Coumn()`的`default`参数可以接受函数作为默认值，所以每次需要生成默认值时，`db.Column()`就会调用指定的函数
`app/models.py`刷新用户的最后访问时间


​    
​        def ping(self):
​            """
​            刷新用户的最后访问时间
​            :return:
​            """
​            self.last_seen = datetime.utcnow()
​            db.session.add(self)


每次收到用户的请求时，都要调用`ping()`方法， `auth`蓝本中的`before_app_request`处理程序会在每次请求前运行
`app/auth/views.py` 更新已登录用户的访问时间


​    
​    @auth.before_app_request
​    def before_request():
​        if current_user.is_authenticated:
​            current_user.ping()                 # 更新已登录用户的访问时间
​            if not current_user.confirmed \
​                and request.endpoint[:5] != 'auth.' \
​                and request.endpoint != 'static':
​                return redirect(url_for('auth.unconfirmed'))


## 10.3 用户资料页面

`app/main/views.py` 资料页面的路由


​    
​    @main.route('/user/<username>')
​    def user(username):
​        user = User.query.filter_by(username=username).first()
​        if user is None:
​            abort(404)
​        return render_template('user.html', user=user)

`app/templates/user.html`

            {% extends "base.html" %}
        {% import "bootstrap/wtf.html" as wtf %}
        {% block title %}Flasky - 个人中心{% endblock%}
        {% block page_content %}
        <div class="page-header">
            <img class="=img-rounded profile-thumbnail" src="{{ user.gravatar(size=256) }}">
            <div class="profile-header">
                <h1>{{ user.username|capitalize }}</h1>
            {% if user.name %}
            <p>
                真实姓名：{% if user.name %}{{ user.name }}{% endif %}
            </p>
            {% endif %}
        {% if current_user.is_administrator() %}
        <p>个人邮箱：<a href="mailto:{{ user.email }}">{{ user.email }}</a></p>
        {% endif %}
        {% if user.about_me %}<p>个人介绍：{{ user.about_me }}</p>{% endif %}
        <p>
            注册时间： {{ moment(user.member_since).format('L') }}，
            {{ moment(user.last_seen).fromNow() }}来过。
        </p>
        <p>
            {% if user == current_user %}
            <a class="btn btn-default" href="{{ url_for('.edit_profile') }}">修改资料</a>
            {% endif %}
            {% if current_user.is_administrator() %}
            <a class="btn btn-danger" href="{{ url_for('.edit_profile_admin', id=user.id) }}">修改资料（管理员）</a>
            {% endif %}
        </p>
        </div>
    </div>
    {% endblock %}


`app/templates/base.html`


```html
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
                    <li><a href="/">首页</a> </li>
                    {% if current_user.is_authenticated %}
                    <li>
                        <a href="{{ url_for('main.user', username=current_user.username) }}">个人中心</a>
                    </li>
                    {% endif %}
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    {% if current_user.is_authenticated %}
                        <li><a href="{{ url_for('auth.logout') }}">退出</a> </li>
                    {% else %}
                        <li><a href="{{ url_for('auth.login') }}">登录</a></li>
                        <li><a href="{{ url_for('auth.register') }}">注册</a></li>
                    {% endif %}
                </ul>
            </div>
        </div>
    </div>
    {% endblock %}
```




## 10.4 资料编辑器

### 10.4.1 用户级别的资料编辑器

`app/main/forms.py` 资料编辑表单


​    
​    class EditProfileForm(FlaskForm):
​        name = StringField('真实姓名', validators=[Length(0, 64)])
​        location = StringField('地址', validators=[Length(0, 64)])
​        about_me = TextAreaField('自我介绍')
​        submit = SubmitField('提交')


`app/main/views.py` 资料编辑路由


​    
​    @main.route('/edit-profile', methods=['GET', 'POST'])
​    @login_required
​    def edit_profile():
​        form = EditProfileForm()
​        if form.validate_on_submit():
​            current_user.name = form.name.data
​            current_user.location = form.location.data
​            current_user.about_me = form.about_me.data
​            db.session.add(current_user)
​            flash("资料已更新！")
​            return redirect(url_for('.user', username=current_user.username))
​        form.name.data = current_user.name          # 显示表单之前，为所有字段设定初始值
​        form.location.data = current_user.location
​        form.about_me.data = current_user.about_me
​        return render_template('edit_profile.html', form=form)


显示表单之前，为所有字段设定初始值 `app/templates/user.html` 资料编辑链接

          {% block page_content %}
        <div class="page-header">
            <img class="=img-rounded profile-thumbnail" src="{{ user.gravatar(size=256) }}">
            <div class="profile-header">
                <h1>{{ user.username|capitalize }}</h1>
            {% if user.name %}
            <p>
                真实姓名：{% if user.name %}{{ user.name }}{% endif %}
            </p>
            {% endif %}
      {% if current_user.is_administrator() %}
        <p>个人邮箱：<a href="mailto:{{ user.email }}">{{ user.email }}</a></p>
        {% endif %}
        {% if user.about_me %}<p>个人介绍：{{ user.about_me }}</p>{% endif %}
        <p>
            注册时间： {{ moment(user.member_since).format('L') }}，
            {{ moment(user.last_seen).fromNow() }}来过。
        </p>
        <p>
            {% if user == current_user %}
            <a class="btn btn-default" href="{{ url_for('.edit_profile') }}">修改资料</a>
            {% endif %}
            {% if current_user.is_administrator() %}
            <a class="btn btn-danger" href="{{ url_for('.edit_profile_admin', id=user.id) }}">修改资料（管理员）</a>
            {% endif %}
        </p>
        </div>
    </div>
    {% endblock %}


### 10.4.2 管理员级别的资料编辑器

`app/mai n/forms.py` 管理员使用的资料编辑表单 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210324195709.png)
`SelectField`实现下拉列表，其实例必须在其`choices`属性中设置各选项：

  * 选项为一个元组组成的列表，各元组都包含两个元素
  * 选项的标识符+显示在控件中的文本字符串
  * 元组中的标识符是角色的id，是整数，所以`coerce`参数设置为`int`，意思是把默认的字符串转化为整数

`self.role.choices = [(role.id, role.name) for role in
Role.query.order_by(Role.name).all()]` `app/main/views.py` 管理员的资料编辑路由


​    
​    @main.route('/edit-profile/<int:id>', methods=['GET', 'POST'])
​    @login_required
​    @admin_required
​    def edit_profile_admin(id):
​        user = User.query.get_or_404(id)
​        form = EditProfileAdminForm(user=user)
​        if form.validate_on_submit():
​            user.email = form.email.data
​            user.username = form.username.data
​            user.confirmed = form.confirmed.data
​            user.role = Role.query.get(form.role.data)
​            user.name = form.name.name
​            user.location = form.location.data
​            user.about_me = form.about_me.data
​            db.session.add(user)
​            flash("个人信息已修改！")
​            return redirect(url_for('.user', username=user.username))
​        form.email.data = user.email
​        form.username.data = user.username
​        form.confirmed.data = user.confirmed
​        form.role.data = user.role
​        form.name.data = user.name
​        form.location.data = user.location
​        form.about_me.data = user.about_me
​        return render_template('edit_profile.html', form=form, user=user)

`user.role =
Role.query.get(form.role.data)`form.role.data是整数，user.role是角色id对应的角色名称
`app/templates/user.html` 管理员使用的资料编辑链接

          {% block page_content %}
        <div class="page-header">
            <img class="=img-rounded profile-thumbnail" src="{{ user.gravatar(size=256) }}">
            <div class="profile-header">
                <h1>{{ user.username|capitalize }}</h1>
            {% if user.name %}
            <p>
                真实姓名：{% if user.name %}{{ user.name }}{% endif %}
            </p>
            {% endif %}
      {% if current_user.is_administrator() %}
        <p>个人邮箱：<a href="mailto:{{ user.email }}">{{ user.email }}</a></p>
        {% endif %}
        {% if user.about_me %}<p>个人介绍：{{ user.about_me }}</p>{% endif %}
        <p>
            注册时间： {{ moment(user.member_since).format('L') }}，
            {{ moment(user.last_seen).fromNow() }}来过。
        </p>
        <p>
            {% if user == current_user %}
            <a class="btn btn-default" href="{{ url_for('.edit_profile') }}">修改资料</a>
            {% endif %}
            {% if current_user.is_administrator() %}
            <a class="btn btn-danger" href="{{ url_for('.edit_profile_admin', id=user.id) }}">修改资料（管理员）</a>
            {% endif %}
        </p>
        </div>
    </div>
    {% endblock %}


## 10.5 用户头像

Gravatar：根据用户的邮箱地址，计算MD5 散列值，然后生成一个唯一的头像链接 `aapp/models.py` 生成`Gravatar URL`


​    
​    import hashlib
​    from flask import current_app, request


​    
​    class User(UserMixin, db.Model):
​        __tablename__ = 'users'
​        id = db.Column(db.Integer, primary_key=True)                                # id
​        email = db.Column(db.String(64), unique=True, index=True)                   # 邮箱
​        username = db.Column(db.String(64), unique=True, index=True)                # 用户名
​        role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))                  # 角色id
​        password_hash = db.Column(db.String(128))                                   # 密码的哈希值
​        confirmed = db.Column(db.Boolean, default=False)                            # 是否验证
​        name = db.Column(db.String(64))                                             # 姓名
​        location = db.Column(db.String(64))                                         # 位置
​        about_me = db.Column(db.Text())                                             # 自我介绍
​        member_since = db.Column(db.DateTime(), default=datetime.utcnow)            # 注册日期
​        last_seen = db.Column(db.DateTime(), default=datetime.utcnow)               # 最后访问日期
​        avatar_hash = db.Column(db.String(32))                                      # 头像URL中用到的hash值
​    
        def __init__(self, **kwargs):
            super(User, self).__init__(**kwargs)                                    # 调用基类构造函数
            if self.role is None:
                if self.email == current_app.config['FLASKY_ADMIN']:                # 管理员
                    self.role = Role.query.filter_by(permissions=0xff).first()
                if self.role is None:
                    self.role = Role.query.filter_by(default=True).first()          # 用户
            if self.email is not None and self.avatar_hash is None:
                self.avatar_hash = hashlib.md5(self.email.encode('utf-8')).hexdigest()


​    
​        def gravatar(self, size=100, default='identicon', rating='g'):
​            if request.is_secure:
​                url = 'https://gravatar.loli.net/avatar/'  # gravatar镜像
​            else:
​                url = 'http://gravatar.loli.net/avatar'
​            hash = self.avatar_hash or hashlib.md5(self.email.encode('utf-8')).hexdigest()
​            return '{url}/{hash}?s={size}&d={default}&r={rating}'.format(url=url, hash=hash,
​                                                                         size=size, default=default, rating=rating)


  * 缓存头像对应的`hash`值
  * 注意`gravatar`函数中使用的`url`，官方的镜像已经被墙，使用的是镜像，[参考](https://sb.sb/blog/css-cdn/)

`app/templates/user.html` 资料页面中的头像

  ```html
    
      <img class="=img-rounded profile-thumbnail" src="{{ user.gravatar(size=256) }}">
  ```




## 10.6 效果展示

  1. 用户登录后界面 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210324191438.png)

  2. 点击个人中心 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210324194228.png)

  3. 点击修改资料 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210324194250.png)

  4. 登录管理员账号，点击个人中心 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210324194340.png)

  5. 点击修改资料（管理员） ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210324194417.png)

  6. 通过用户名或者用户id修改用户资料 

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210324194439.png)

