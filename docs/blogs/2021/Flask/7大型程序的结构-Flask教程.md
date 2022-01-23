---
title: Flask学习之7 大型程序的结构
date: 2021-03-15
permalink: /flask-learning-large-program-structure.html
tags:
 - Flask
categories:
 - Flask
---



# 7大型程序的结构

## 7.1 前言

> 项目地址：https://gitee.com/guangmujun/micro-blog 个人网站：https://guangmujun.cn
> Flask Web学习：https://guangmujun.cn/archives/category/learning-note/flask-web
> MySQL学习：https://guangmujun.cn/archives/category/learning-note/mysql-note 参考：
>
>   * https://segmentfault.com/q/1010000006212779
>   * https://blog.csdn.net/sinat_38682860/article/details/89764237
>   * https://blog.csdn.net/chekongfu/article/details/83187591
>

从单一脚本方式调整为一种使用包和模块组织大型程序的方式 调整后的项目结构如下图所示：

  * Flask程序一般都保存在名为`app`的包中
  * `migrations`存储数据库迁移脚本
  * 单元测试编写在`tests`包中
  * `notes`存储学习笔记
  * `requirements.txt`列出项目所有依赖包
  * `config.py`存储配置
  * `manage.py`用于启动程序

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210315141411.png)

## 7.2 配置选项

程序开发需要设定多个配置， 如，开发、测试和生产环境使用不同的程序库 hello.py中使用简单的字典状结构进行配置，这里我们使用层次结构的配置类
config.py


​    
    import os


​    
    class Config:
        SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard to guess'
        SQLALCHEMY_COMMIT_ON_TEARDOWN = True
        SQLALCHEMY_TRACK_MODIFICATIONS = True
        FLASKY_MAIL_SUBJECT_PREFIX = '[Flasky]'
        FLASKY_MAIL_SENDER = os.environ.get('FLASKY_MAIL_SENDER')
        FLASKY_ADMIN = os.environ.get('FLASKY_ADMIN')
    
        @staticmethod  # 返回函数的静态方法，静态方法可直接使用，如Config.init_app()，不需要实例化
        def init_app(app):  # 自定义的一个初始化方法
            pass


​    
    class DevelopmentConfig(Config):
        DEBUG = True
        MAIL_SERVER = 'smtp.sina.com'
        MAIL_PORT = 25
        MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
        MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
        SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URI')


​    
    class TestingConfig(Config):
        TESTING = True
        SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URI')


​    
    class ProductionConfig(Config):
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI')


​    
    config = {
        'development': DevelopmentConfig,
        'testing': TestingConfig,
        'production': ProductionConfig,
    
        'default': DevelopmentConfig
    }


​    
​    
​    

说明：

  * 基类Config中包含通用配置，子类分别定义专用的配置
  * 定义了三个子类，分别用于开发、测试和生产环境，而且指定了不同的数据库
  * init_app()方法，参数是程序实例，用于执行对当前环境的配置初始化
  * 程序末尾，config字典中注册了不同的配置环境，默认为开发环境

## 7.3 程序包

指被制作成包的app文件夹

### 7.3.1 使用程序工厂函数

**需求：**

  * 单文件结构的缺点，由于程序在全局作用域中创建，所以无法动态修改 **配置** 。
  * 有时为了提高测试的覆盖度，必须在不同的 **配置** 环境中运行程序

**解决：** 使用工厂函数

  * 工厂函数`create_app()`以配置的名称作为输入参数，故可动态修改配置
  * 程序创建并配置好后，进行初始化扩展
  * 返回创建的程序实例

`app/__init__.py:`


​    
​      
    from flask import Flask
    from flask_bootstrap import Bootstrap
    from flask_moment import Moment
    from flask_sqlalchemy import SQLAlchemy
    from flask_mail import Mail
    
    from config import config
    
    bootstrap = Bootstrap()
    moment = Moment()
    db = SQLAlchemy()
    mail = Mail()


​    
    def create_app(config_name):
        app = Flask(__name__)
        app.config.from_object(config[config_name])  # 指定配置类的名称development/testing/production,默认是development
        config[config_name].init_app(app)            # 初始化扩展
    
        bootstrap.init_app(app)                      # 初始化扩展
        mail.init_app(app)
        moment.init_app(app)
        db.init_app(app)
    
        from .main import main as main_blueprint    # 导入名称为main的蓝本
        app.register_blueprint(main_blueprint)      # 将蓝本注册到程序
    
        return app


​    
​    

### 7.3.2 在蓝本中实现程序功能

**需求：**

  * 单脚本程序中，程序实例存在于全局作用域中，路由直接使用`app.route`修饰器定义
  * 现在程序在运行时创建实例，只有调用`create_app()`之后才能使用`app.route`修饰器

**解决：** 蓝本`Blueprint`

  * 蓝本中定义的路由处于休眠状态，直到蓝本注册到程序上后，路由才被激活
  * 在`app`包中创建子包`main`，用于保存蓝本

`app/main/__init__.py`


​    
    from flask import Blueprint
    
    main = Blueprint('main', __name__)  # param 1：蓝本的名字，param 2：蓝本所在的包或模块
    
    from . import views, errors


此处使用`from . import views, errors`，将路由和错误的处理程序与蓝本关联起来 `app/__init__.py`


​    
​      
    def create_app(config_name):
        # ...
    
        from .main import main as main_blueprint    # 导入名称为main的蓝本
        app.register_blueprint(main_blueprint)      # 将蓝本注册到程序
    
        return app


`app/main/views.py`


​    
    from datetime import datetime
    from flask import render_template, session, redirect, url_for, flash, current_app
    
    from . import main
    from .forms import NameForm
    from .. import db
    from ..models import User
    from ..email import send_email


​    
    @main.route('/', methods=['GET', 'POST'])
    def index():
        form = NameForm()
        if form.validate_on_submit():
    
            user = User.query.filter_by(username=form.name.data).first()
            if user is None:
                user = User(username=form.name.data)
                db.session.add(user)
                session['known'] = False
                if current_app.config['FLASKY_ADMIN']:                                                      # 发送邮件
                    send_email(current_app.config['FLASKY_ADMIN'], 'New User', 'mail/new_user', user=user)  # 使用mail文件夹下的new_user模板
            else:
                session['known'] = True
    
            old_name = session.get('name')
            if old_name is not None and old_name != form.name.data:
                flash("姓名已修改！")
            session['name'] = form.name.data
            form.name.data = ''
            return redirect(url_for('.index'))
        return render_template('index.html', form=form, name=session.get('name'), known=session.get('known', False),
                               current_time=datetime.utcnow())


​    

路由修饰器，由蓝本`main`提供，`url_for()`参数为路由的端点名，但是在蓝本中，Flask会为蓝本中的全部端点加上一个命名空间，这样就可以在不同的蓝本中使用相同的端点定义视图函数，所以视图函数index()注册的端点名是main.index，所以应该写成`url_for('main.index')`或是简写为`url_for(''.index')`
`app/main/errors.py`


​    
    from flask import render_template
    from . import main


​    
    @main.app_errorhandler(404)
    def page_not_found(e):
        return render_template('404.html')


​    
    @main.app_errorhandler(500)
    def page_not_found(e):
        return render_template('500.html')


​    

导入蓝本`from . import main`，使用`app_errorhandler`注册程序全局的错误处理程序 `app/main/forms.py`


​    
    from flask_wtf import FlaskForm
    from wtforms import StringField, SubmitField
    from wtforms.validators import DataRequired


​    
    class NameForm(FlaskForm):
        name = StringField('请输入你的名字：', validators=[DataRequired()])
        submit = SubmitField('提交')


​    

## 7.4 启动脚本

manage.py


​    
​      
    from app import create_app, db
    from app.models import User, Role
    from flask_script import Manager, Shell
    from flask_migrate import Migrate, MigrateCommand
    
    import pymysql
    pymysql.install_as_MySQLdb()
    
    app = create_app('default')  # 设定开发环境
    manager = Manager(app)
    migrate = Migrate(app, db)


​    
    def make_shell_context():
        return dict(app=app, db=db, User=User, Role=Role)


​    
    manager.add_command('db', MigrateCommand)
    manager.add_command("shell", Shell(make_context=make_shell_context))
    
    if __name__ == '__main__':
        manager.run()


​    

在PyCharm中设置运行的`环境变量`和`参数`，在运行程序之前，要先创建数据库

## 7.5 需求文件

  * pip 
    * 导出
    
        pip freeze > requirements.txt
    

    * 安装
    
        pip install -r requirements.txt
    
  * conda 
    * 导出
    
        conda list -e > requirements.txt
    

    * 安装
    
        conda install --yes --file requirements.txt
    

## 7.6 单元测试

`setUp()`和`tearDown()`分别在测试前后运行，并且名字以`test_`开头的函数都作为测试执行
第一个测试确保程序实例存在，第二个测试确保在测试配置中运行 将tests作为包使用，故在tests文件夹下新建`__init__.py`文件，内容可以为空
`tests/test_basics.py`


​    
​      
    import unittest
    from flask import current_app
    from app import create_app, db


​    
    class BasicsTestCase(unittest.TestCase):
        def setUp(self):
            self.app = create_app('testing')
            self.app_context = self.app.app_context()
            self.app_context.push()
            db.create_all()
    
        def tearDown(self):
            db.session.remove()
            db.drop_all()
            self.app_context.pop()
    
        def test_app_exists(self):
            self.assertFalse(current_app is None)
    
        def test_app_is_testing(self):
            self.assertTrue(current_app.config['TESTING'])


​    

`manage.py`


​    
    @manager.command
    def test():
        import unittest
        tests = unittest.TestLoader().discover('tests')  # tests包
        unittest.TextTestRunner(verbosity=2).run(tests)


使用`python manage.py test`命令进行测试 如果在PyCharm中运行脚本，记得修改运行参数为`test`，效果如下：
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210315152056.png)

## 7.7 创建数据库和运行项目

**提醒：** 程序运行之前要设置好环境变量

  1. 在PyCharm中设置好环境变量，运行参数设置为`shell`，运行`manage.py`
  2. 在出现的shell窗口中，输入`db.create_all()`创建表，然后可进行插入数据等操作，
  3. 数据库操作完成后，修改PyCharm的运行参数为`runserver`，运行`manage.py`
  4. 此时项目效果和之前的单脚本程序的效果一致

对于创建数据表或者升级到最新修订版本，可使用下述命令


​    
    python manage.py db upgrade


建议在PyCharm的运行参数设置中，修改为`db upgrade`，然后运行，运行时，之前设置的环境变量也都会被一同设置。

## 7.8 知识补充

  1. app包中的`__init__.py`文件

  * `__init__.py`文件用于组织包（package）
  * 包（package）的概念：简单来说，包是含有python模块的文件夹
  * 一个python模块（module）为一个py文件，里面写有函数和类。包（package）是为了更好的管理模块（module）,相当于多个模块的父节点。
  * 当文件夹下有`__init__.py`时，表示当前文件夹是一个package，其下的多个module统一构成一个整体。这些module都可以通过同一个package引入代码中。

  2. `init_app()`函数

config.py


​    
    class Config:
        SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard to guess'
        SQLALCHEMY_COMMIT_ON_TEARDOWN = True
        SQLALCHEMY_TRACK_MODIFICATIONS = True
        FLASKY_MAIL_SUBJECT_PREFIX = '[Flasky]'
        FLASKY_MAIL_SENDER = os.environ.get('FLASKY_MAIL_SENDER')
        FLASKY_ADMIN = os.environ.get('FLASKY_ADMIN')
    
        @staticmethod  # 返回函数的静态方法，静态方法可直接使用，如Config.init_app()，不需要实例化
        def init_app(app):  # 自定义的一个初始化方法
            pass


Config类中自定义一个`init_app()`方法， `app/__init__.py`


​    
    def create_app(config_name):
        app = Flask(__name__)
        app.config.from_object(config[config_name])  # 指定配置类的名称development/testing/production,默认是development
        config[config_name].init_app(app)            # 初始化扩展
    
        bootstrap.init_app(app)
        mail.init_app(app)
        moment.init_app(app)
        db.init_app(app)


类似于`bootstrap.init_app(app)`这种的`init_app()`函数都是类似于`bootstrap`这些程序实例，其对应的类中都定义了`init_app()`这个方法，用于执行对当前环境的配置初始化

