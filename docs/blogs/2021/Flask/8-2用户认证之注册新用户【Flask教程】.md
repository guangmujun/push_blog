---
title: Flask学习之8-2 用户认证：注册新用户
date: 2021-03-18
permalink: /flask-learning-register-new-user.html
tags:
 - Flask
categories:
 - Flask
---

## 8.6 注册新用户

提交注册表单，通过验证后，系统就使用用户填写的信息在数据库中添加一个新用户

### 8.6.1 添加用户注册表单

`app/auth/forms.py` 见仓库中对应提交记录的文件
Regexp用于限制用户名只能包含数据字母下划线和点号，EqualTo用于验证两次输入的密码是否一致 **注册模板设置**
`templates/auth/register.html`


​    
    {% extends "base.html" %}
    {% import "bootstrap/wtf.html" as wtf %}
    {% block title %}Flasky - Login{% endblock%}
    
    {% block page_content %}
    <div class="page-header">
        <h1>注册</h1>
    </div>
    <div class="col-md-4">
        {{ wtf.quick_form(form) }}
    </div>
    {% endblock %}


**登录页面设置注册链接** `templates/auth/login.html`


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
    <p><a href="{{ url_for('auth.register') }}">新用户注册</a></p>
    {% endblock %}


​    

### 8.6.2 注册新用户

`app/auth/views.py`


​    
    @auth.route('/register', methods=['GET', 'POST'])
    def register():
        form = RegistrationForm()
        if form.validate_on_submit():
            user = User(email=form.email.data,
                        username=form.username.data,
                        password=form.password.data)
            db.session.add(user)
            flash('注册成功，请登录！')
            return redirect(url_for('auth.login'))
        return render_template('auth/register.html', form=form)


### 8.6.3 效果展示

  1. 点击登录按钮 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317162031.png)

  2. 点击“新用户注册” ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317162052.png)

  3. 输入注册信息，点击注册 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317162131.png) ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317162152.png)

  4. 输入新注册的邮箱和密码，登录 

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317162231.png)

