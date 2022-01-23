---
title: Flask学习之5 数据库
date: 2021-03-14
permalink: /flask-learning-databse.html
tags:
 - Flask
categories:
 - Flask

---

# 5数据库

## 5.1 前言

> 项目地址：https://gitee.com/guangmujun/micro-blog 个人网站：https://guangmujun.cn
> MySQL学习：https://guangmujun.cn/archives/category/learning-note/mysql-note
> 参考：https://stackoverflow.com/questions/53024891/modulenotfounderror-no-
> module-named-mysqldb

## 5.2 数据库

  * 关系型数据库（SQL数据库）
  * 非关系型数据库（NoSQL数据库）

**SQL数据库**

  * 行之间的联系称为关系
  * 存储数据高效，但数据存放在多种表中较为复杂

**NoSQL数据库**

  * 减少表的数量，增加了数据重复量
  * 数据重复可以提升查询速度

**两种数据库的评价**

  * SQL数据库擅于用高效且紧凑的形式存储结构化数据
  * NoSQL放宽了一致性要求，获得性能上的优势

## 5.3 Python数据库框架

**抽象层代码包**

  * 直接处理高等级的Python对象，而不用处理数据库的实体
  * 使用ORM或ODM将对象业务转换成数据库业务会有一定损耗，但微不足道

**抽象层**

  * 对象关系映射（Object-Relational Mapper, ORM ）或对象文档映射（Object-Document Mapper, ODM）
  * 把高层的面向对象操作转换成低层的数据库指令

## 5.5 使用Flask-SQLAlchemy管理MySQL

**安装扩展**


​    
    conda install flask-sqlalchemy
    conda install pymysql


**配置数据库**

  * `SQLALCHEMY_DATABASE_URI`设置数据库的URI
  * `SQLALCHEMY_COMMIT_ON_TEARDOWN`设置自动提交数据库中的变动
  * `SQLALCHEMY_TRACK_MODIFICATIONS`设置为Ture或False均可，不然会有warning

hello.py


​    
    from flask_sqlalchemy import SQLAlchemy
    import pymysql
    pymysql.install_as_MySQLdb()
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://{user}:{password}@{server}/{database}'.format(
                                    user='your-username', password='your-password', server='your-ip-port', database='your-database')
    app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    
    db = SQLAlchemy(app)


## 5.5 定义模型和关系

hello.py


​    
    class Role(db.Model):
        __tablename__ = 'roles'
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(64), unique=True)
        users = db.relationship('User', backref='role')
    
        def __repr__(self):
            return '<Role %r>' % self.name


​    
    class User(db.Model):
        __tablename__ = 'users'
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(64), unique=True, index=True)
        role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    
        def __repr__(self):
            return '<User %r>' % self.username


  * `__repr__`返回一个具有可读性的字符串表示模型，在调试和测试时使用
  * `index=True`为此列创建索引，提升查询效率
  * `Role`模型中的`users`返回与角色相关联的用户列表
  * `db.relationship()`
    * 第一个参数表示此关系另一端的模型名称
    * `backref`参数向`User`模型中添加一个`role`属性，这一属性可替代`role_id`访问`Role`模型

## 5.6 数据库操作

### 5.6.1 创建表


​    
    python hello.py shell
    from hello import db
    db.create_all()


在shell中输入上述命令后，连接MySQL，效果如下： ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210313114844.png)

### 5.6.2 插入行

```python <blockquote> <blockquote> <blockquote> from hello import Role, User
admin_role = Role(name='Admin') mod_role = Role(name='Moderator') user_role =
Role(name='User') user_join = User(username='join', role=admin_role)
user_susan = User(username='susan', role=mod_role) user_tom =
User(username='tom', role=user_role) db.session.add_all([admin_role, mod_role,
user_role, user_join, user_susan, user_tom]) db.session.commit() </blockquote>
</blockquote> </blockquote> ``` ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210314193515.png) ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210314193529.png)

### 5.6.3 修改行

    
    
    >>> mod_role.name = 'Mod'
    >>> db.session.add(mod_role)
    >>> db.session.commit()
    
    

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210314194102.png)

### 5.6.4 删除行

    
    
    >>> db.session.delete(admin_role)
    >>> db.session.commit()
    

### 5.6.3 查询行

    
    
    >>> Role.query.all()
    [<Role 'Admin'>, <Role 'Mod'>, <Role 'User'>]
    >>> User.query.filter_by(role=user_role).all()
    [<User 'tom'>]
    
    

**过滤器：** 参考：http://docs.sqlalchemy.org

  * filter()
  * filter_by()
  * limit()
  * offset()
  * order_by()
  * group_by()

**查询方法：**

  * all()
  * first()
  * first_or_404()
  * get()
  * get_or_404()
  * count()
  * paginate()

**自动执行查询：**

    
    
    class Role(db.Model):
        users = db.relationship('User', backref='role', lazy='dynamic')
    

此处使用`lazy`参数后，`user_role.users`会返回一个尚未执行的查询，可将其修改为

    
    
    user_role.users.order_by(User.username).all()
    

## 5.7 在视图函数中操作数据库

hello.py

    
    
      
    @app.route('/', methods=['GET', 'POST'])
    def index():
        form = NameForm()
        if form.validate_on_submit():
    
            user = User.query.filter_by(username=form.name.data).first()
            if user is None:
                user = User(username=form.name.data)
                db.session.add(user)
                session['known'] = False
            else:
                session['known'] = True
    
            old_name = session.get('name')
            if old_name is not None and old_name != form.name.data:
                flash("姓名已修改！")
            session['name'] = form.name.data
            return redirect(url_for('index'))
        return render_template('index.html', form=form, name=session.get('name'),known=session.get('known', False),
                               current_time=datetime.utcnow())
    
    

index.html

    
    
    {% extends "base.html" %}
    {% import "bootstrap/wtf.html" as wtf %}
    
    {% block title %}Flasky{% endblock %}
    
    {% block page_content %}
    <div class="page_content">
        <div class="page-header">
            <h1>你好, {% if name %}{{ name }}{% else %}陌生人{% endif %}!</h1>
    
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
    

第一次打开首页效果 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210314200032.png) 输入框中输入“广慕君”，点击提交的效果
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210314200126.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210314200153.png)
输入框中再次输入“广慕君”，点击提交后的效果 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210314200221.png)

## 5.8 集成Python shell

让Flask-Script的shell命令自动导入特定的对象

    
    
    from flask_script import Shell
    
    
    def make_shell_context():
        return dict(app=app, db=db, User=User, Role=Role)
    
    
    manager.add_command("shell", Shell(make_context=make_shell_context))
    

效果

    
    
    python hello.py shell
    >>> app
    <Flask 'hello'>
    >>> User
    <class '__main__.User'>
    

## 5.9 使用Flask-MIgrate实现数据库迁移

**需求：** 修改数据库模型后，需要更新数据库，但使用Flask-
SQLAlchemy时，需要先删除旧表，然后才能根据新的模型创建表，如此操作会丢失数据库中的所有数据。 更好的方法是用 **数据库迁移框架**
，类似于原码版本控制，可以跟踪数据库模型的变化，然后增量式的把变化应用到数据库中。

### 5.9.1 创建迁移仓库

安装：

    
    
    conda install flask-migrate
    

配置：

    
    
    from flask_migrate import Migrate, MigrateCommand
    
    migrate = Migrate(app, db)
    manager.add_command('db', MigrateCommand)
    

创建迁移仓库

    
    
    python hello.py db inti
    

### 5.9.2 创建迁移脚本

    
    
    python hello.py db migrate -m "迁移信息"
    

### 5.9.3 更新数据库

    
    
    python hello.py db upgrade
    

