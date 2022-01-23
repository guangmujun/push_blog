---
title: Flask学习之8-3 用户认证：确认用户
date: 2021-03-18
permalink: /flask-learning-make-sure-user.html
tags:
 - Flask
categories:
 - Flask

---



## 8.7 确认账户

发送验证电子邮件，让用户点击一个包含确认令牌的特殊URL链接

### 8.7.1 使用itsdangerous生成确认令牌

**简单做法：** 最简单的确认链接是：`http://www.example.com/auth/confirm/<id>`，这种形式的URL，
其中id是数据库分配给用户的数字id 用户点击链接后，处理这个路由的视图函数就将收到的用户id作为参数进行确认， 然后将用户状态更新为已确认 **改进：**
使用生成的令牌字符串代替简单的用户id `app/models.py`


​    
    from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
    from flask import current_app
    from . import db
    
    class User(UserMixin, db.Model):
        __tablename__ = 'users'
        id = db.Column(db.Integer, primary_key=True)
        email = db.Column(db.String(64), unique=True, index=True)
        username = db.Column(db.String(64), unique=True, index=True)
        role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
        password_hash = db.Column(db.String(128))
        confirmed = db.Column(db.Boolean, default=False)  # 是否验证
    
        def generate_confirmation_token(self, expiration=3600):
            s = Serializer(current_app.config['SECRET_KEY'], expiration)
            return s.dumps({'confirm': self.id})
    
        def confirm(self, token):
            s = Serializer(current_app.config['SECRET_KEY'])
            try:
                data = s.loads(token)
            except:
                return False
            if data.get('confirm') != self.id:
                return False
                self.confirmed = True
                db.session.add(self)
            return True


​    
​    

  * `generate_confirmation_token()`生成有效期为1个小时的令牌 
    * `dumps()`方法为指定的数据生成一个加密签名，然后再对数据和签名进行序列化，生成令牌字符串
  * `confirm()`用来检验令牌 
    * `TimedJSONWebSignatureSerializer`生成具有过期时间的JSON Web签名
    * `loads()`用来解码令牌，会检验签名和过期时间
    * 令牌成功解码后，还会检查解码后的id和存储在`current_user`中的已登录的用户是否匹配

**User模型改动后的测试：** `tests/test_basics.py`


​    
        def test_valid_confirmation_token(self):
            u = User(password='cat')
            db.session.add(u)
            db.session.commit()
            token = u.generate_confirmation_token()
            self.assertTrue(u.confirm(token))
    
        def test_invalid_confirmation_token(self):
            u1 = User(password='cat')
            u2 = User(password='dog')
            db.session.add(u1)
            db.session.add(u2)
            db.session.commit()
            token = u1.generate_confirmation_token()
            self.assertFalse(u2.confirm(token))
    
        def test_expired_confirmation_token(self):
            u = User(password='cat')
            db.session.add(u)
            db.session.commit()
            token = u.generate_confirmation_token(expiration=1)
            time.sleep(2)
            self.assertFalse(u.confirm(token))


### 8.7.2 发送确认邮件

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
            db.session.commit()  # 确认令牌需要用到id，提交数据库后才会生成id
            token = user.generate_confirmation_token()
            send_email(user.email, '确认您的注册账户', 'auth/email/confirm', user=user, token=token)
            flash('注册确认邮件已发送到您的邮件，请查收！')
            return redirect(url_for('auth.login'))
        return render_template('auth/register.html', form=form)


电子邮件模板 要使用`_external=True`生成绝对完整的URL， `templates/auth/email/confirm.html`


​    
    <p>Dear {{ user.username }},</p>
    <p>Welcome to <b>Flasky</b>!</p>
    <p>To confirm your account please <a href="{{ url_for('auth.confirm', token=token, _external=True) }}">click here</a>.</p>
    <p>Alternatively, you can paste the following link in your browser's address bar:</p>
    <p>{{ url_for('auth.confirm', token=token, _external=True) }}</p>
    <p>Sincerely,</p>
    <p>The Flasky Team</p>
    <p><small>Note: replies to this email address are not monitored.</small></p>


​    

`templates/auth/email/confirm.txt`


​    
    Dear {{ user.username }},
    
    Welcome to Flasky!
    
    To confirm your account please click on the following link:
    
    {{ url_for('auth.confirm', token=token, _external=True) }}
    
    Sincerely,
    
    The Flasky Team
    
    Note: replies to this email address are not monitored.


​    

确认账户的视图函数 `app/auth/views.py`


​    
    @auth.route('/confirm/<token>')
    @login_required
    def confirm(token):
        if current_user.confirmed:                  # 目前用户已认证
            return redirect(url_for('main.index'))
        if current_user.confirm(token):             # 用户验证成功
            flash('您的账户已验证，欢迎！')
        else:
            flash('邮件中的验证链接已过期！')
        return redirect(url_for('main.index'))


要求用户在获取权限之前先确认账户 `app/auth/views.py`


​    
    @auth.before_app_request
    def before_request():
        if current_user.is_authenticated \
                and not current_user.confirmed \
                and request.endpoint[:5] != 'auth.' \
                and request.endpoint != 'static':
            return redirect(url_for('auth.unconfirmed'))


​    
    @auth.route('/unconfirmed')
    def unconfirmed():
        if current_user.is_anonymous or current_user.confirmed:
            return redirect(url_for('main.index'))
        return render_template('auth/unconfirmed.html')


`before_request`钩子，只能应用到属于蓝本的请求上， `before_app_request`可以在蓝本中使用针对程序全局请求的钩子
满足以下3个条件时，`before_app_request`处理程序会拦截请求：

  * 用户已登录
  * 用户的账户还未确认
  * 请求的端点不在认证蓝本中

未确认用户的视图函数 `app/ayth/views.py`


​    
    @auth.route('/confirm')
    @login_required
    def resend_confirmation():
        token = current_user.generate_confirmation_token()
        send_email(current_user.email, '确认您的账户', 'auth/email/confirm', user=current_user, token=token)
        flash("一封新的确认邮件已经发送到您的邮箱！")
        return redirect(url_for('main.index'))


未确认用户的模板 `templates/auth/unconfirmed.html`


​    
    {% extends "base.html" %}
    
    {% block title %}Flasky - Confirm your account{% endblock %}
    
    {% block page_content %}
    <div class="page-header">
        <h1>
            Hello, {{ current_user.username }}!
        </h1>
        <h3>You have not confirmed your account yet.</h3>
        <p>
            Before you can access this site you need to confirm your account.
            Check your inbox, you should have received an email with a confirmation link.
        </p>
        <p>
            Need another confirmation email?
            <a href="{{ url_for('auth.resend_confirmation') }}">Click here</a>
        </p>
    </div>
    {% endblock %}


​    

### 8.7.3 数据库更新与测试

依次修改pycharm的运行参数进行运行

  * 数据库迁移：db migrate -m “增加确认字段”

  * 数据库更新：db upgrade

  * 测试：test

### 8.7.4 效果展示

  1. 在注册页面点击注册 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317203246.png)

  2. 查看收到的邮件 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317203337.png)

  3. 点击邮件中链接 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317203400.png)

  4. 在链接中输入邮箱和密码，点击登录 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317203437.png)

  5. 注册后，不点击邮箱中链接进行认证，而是直接输入账号密码登录 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317203611.png)

  6. 点击上图中的链接， ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210317203638.png)

  7. 再次收到邮件，点击邮件的认证链接，可正常登录

## 问题记录

**问题一：** 表单中的邮箱验证异常


​    
    Exception: Install 'email_validator' for email validation support.


**解决：**

  1. 安装email_validator


​    
    conda install email_validator


  2. 表单的py文件中引入email_validator即可


​    
    import email_validator

