---
title: Flask学习之6电子邮件
date: 2021-03-15
permalink: /flask-learning-email.html
tags:
 - Flask
categories:
 - Flask
---



# 6电子邮件

## 6.1 前言

> 项目地址：https://gitee.com/guangmujun/micro-blog 个人网站：https://guangmujun.cn
> Flask Web学习：https://guangmujun.cn/archives/category/learning-note/flask-web
> MySQL学习：https://guangmujun.cn/archives/category/learning-note/mysql-note
> 参考：https://guangmujun.cn/archives/424

## 6.2 使用Flask-Mail提供电子邮件支持

**安装：**


​    
    conda install flask-mail


**配置：** Flask-Mail连接到简单邮件传输协议（SMTP）服务器，并把邮件交给这个服务器发送。 hello.py配置Flask-
Mail使用Sina


​    
    app.config['MAIL_SERVER'] = 'smtp.sina.com'
    app.config['MAIL_PORT'] = 25
    app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
    app.config['FLASKY_MAIL_SUBJECT_PREFIX'] = '[Flasky]'
    app.config['FLASKY_MAIL_SENDER'] = os.environ.get('FLASKY_MAIL_SENDER')
    app.config['FLASKY_ADMIN'] = os.environ.get('FLASKY_ADMIN')


  * `MAIL_USERNAME`：新浪邮箱的账号
  * `MAIL_PASSWORD`：不是新浪邮箱的密码，而是启用POP3/SMTP服务的授权码
  * `FLASKY_MAIL_SENDER`：类似这样`Flasky Admin <xxxxxxx@sina.com>`，填入新浪的邮箱
  * `FLASKY_ADMIN`：用于接收邮件的管理员邮箱，可以填自己的其他的163、qq邮箱等

为了个人的账号密码信息等不泄露，已将敏感信息写入环境变量中，相关操作参考：https://guangmujun.cn/archives/424
**初始化：** hello.py


​    
    from flask_mail import Mail, Message
    
    mail = Mail(app)


## 6.3 在程序中集成发送电子邮件功能

**案例：** 每当表单接收一个新名字时，程序发送一封邮件给管理员 hello.py


​    
    def send_email(to, subject, template, **kwargs):
        """
        用于程序发送邮件
        :param to: 收件人
        :param subject: 主题
        :param template: 邮件模板
        :param kwargs: 可选参数
        :return: 程序向收件人发送一封邮件
        """
        msg = Message(app.config['FLASKY_MAIL_SUBJECT_PREFIX'] + subject,
                      sender=app.config['FLASKY_MAIL_SENDER'], recipients=[to])
        msg.body = render_template(template + '.txt', **kwargs)
        msg.html = render_template(template + '.html', **kwargs)
        mail.send(msg)
    
    @app.route('/', methods=['GET', 'POST'])
    def index():
        form = NameForm()
        if form.validate_on_submit():
    
            user = User.query.filter_by(username=form.name.data).first()
            if user is None:
                user = User(username=form.name.data)
                db.session.add(user)
                session['known'] = False
                if app.config['FLASKY_ADMIN']:                                                      # 发送邮件
                    send_email(app.config['FLASKY_ADMIN'], 'New User', 'mail/new_user', user=user)  # 使用mail文件夹下的new_user模板
            else:
                session['known'] = True
    
            old_name = session.get('name')
            if old_name is not None and old_name != form.name.data:
                flash("姓名已修改！")
            session['name'] = form.name.data
            form.name.data = ''
            return redirect(url_for('index'))
        return render_template('index.html', form=form, name=session.get('name'),known=session.get('known', False),
                               current_time=datetime.utcnow())


new_user.html


​    
    <meta charset="utf-8">
    <p>Dear {{ user.username }},</p>


new_user.txt


​    
    Dear {{ user.username }},


## 6.4 案例运行效果

在PyCharm中设置好程序需要的环境变量 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210315101059.png) 运行程序，在表单中输入“番茄”后，效果如下：
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210315101138.png)
此时查看我们的管理员邮箱，即`FLASKY_ADMIN`对应的邮箱，效果如下： ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210315101242.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210315101306.png)

## 6.5 异步发送电子邮件

**原因：** 当我们在表单中输入新的名字并提交后，发现有几秒钟，浏览器就像无响应的状态一样 为了避免不必要的延迟，将发送电子邮件的函数移动到后台线程中，
即提交表单后，浏览器页面正常跳转，后台线程进行发送邮件的操作 hello.py


​    
    from threading import Thread


​    
    def send_async_email(app, msg):
        with app.app_context():
            mail.send(msg)


​    
    def send_email(to, subject, template, **kwargs):
        """
        用于程序发送邮件
        :param to: 收件人
        :param subject: 主题
        :param template: 邮件模板
        :param kwargs: 可选参数
        :return: 程序向收件人发送一封邮件
        """
        msg = Message(app.config['FLASKY_MAIL_SUBJECT_PREFIX'] + subject,
                      sender=app.config['FLASKY_MAIL_SENDER'], recipients=[to])
        msg.body = render_template(template + '.txt', **kwargs)
        msg.html = render_template(template + '.html', **kwargs)
        thr = Thread(target=send_async_email, args=[app, msg])
        thr.start()
        return thr

