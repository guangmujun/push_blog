---
title: Flask学习之9 用户角色
date: 2021-03-18
permalink: /flask-learning-user-role.html
tags:
 - Flask
categories:
 - Flask
---



# 9用户角色

## 9.1 前言

> 项目地址：https://gitee.com/guangmujun/micro-blog 个人网站：https://guangmujun.cn
> Flask Web学习：https://guangmujun.cn/archives/category/learning-note/flask-web
> MySQL学习：https://guangmujun.cn/archives/category/learning-note/mysql-note 参考：

## 9.2 角色在数据库中的表示

`app/models.py` 定义不同的权限


​    
    class Permission:               # 不同的权限
        FOLLOW = 0x01               # 关注其他用户
        COMMENT = 0x02              # 可在文章中发布评论
        WRITE_ARTICLES = 0x04       # 写文章
        MODERATE_COMMENTS = 0x08    # 管理他人的评论
        ADMINISTER = 0x80           # 管理网站


定义具有不同权限组合的用户


​    
    class Role(db.Model):
        __tablename__ = 'roles'
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(64), unique=True)
        default = db.Column(db.Boolean, default=False, index=True)
        permissions = db.Column(db.Integer)
        users = db.relationship('User', backref='role', lazy='dynamic')
    
        def __repr__(self):
            return '<Role %r>' % self.name
    
        @staticmethod
        def insert_roles():
            roles = {                                                   # 具有不同权限组合的用户
                'User': (Permission.FOLLOW |
                         Permission.COMMENT |
                         Permission.WRITE_ARTICLES, True),
                'Moderator': (Permission.FOLLOW |
                              Permission.COMMENT |
                              Permission.WRITE_ARTICLES |
                              Permission.MODERATE_COMMENTS, False),
                'Administrator': (0xff, False)
            }
            for r in roles:
                role = Role.query.filter_by(name=r).first()
                if role is None:
                    role = Role(name=r)
                role.permissions = roles[r][0]
                role.default = roles[r][1]
                db.session.add(role)
            db.session.commit()


迁移更新数据库 将角色写入数据库


​    
    >>> Role.insert_roles()
    >>> Role.query.all()
    [<Role 'User'>, <Role 'Moderator'>, <Role 'Administrator'>]


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210318100148.png)

## 9.3 赋予角色

用户注册时，根据其电子邮件，确定赋予其管理员角色，还是用户角色。 `app/models.py`


​    
    class User(UserMixin, db.Model):
        ...
    
        def __init__(self, **kwargs):
            super(User, self).__init__(**kwargs)                                    # 调用基类构造函数
            if self.role is None:
                if self.email == current_app.config['FLASKY_ADMIN']:                # 管理员
                    self.role = Role.query.filter_by(permissions=0xff).first()
                if self.role is None:
                    self.role = Role.query.filter_by(default=True).first()          # 用户


## 9.4 角色验证

检查是否有指定的权限 `app/models.py`


​    
    from flask_login import UserMixin, AnonymousUserMixin
    
    def can(self, permissions):  # 请求角色和赋予角色进行位与操作
        return self.role is not None and \
    (self.role.permissions & permissions) == permissions
    
    def is_administrator(self):  # 检查管理员角色
        return self.can(Permission.ADMINISTER)
    
    class AnonymousUser(AnonymousUserMixin):  # 用户未登录时current_user的值
        def can(self, permissions):
            return False
    
        def is_administrator(self):
            return False


​    

`app/decorators.py`


​    
​      
    from functools import wraps
    from flask import abort
    from flask_login import current_user
    from .models import Permission


​    
    def permission_required(permission):
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                if not current_user.can(permission):  # 用户不具有指定权限，返回403错误
                    abort(403)
                return f(*args, **kwargs)
            return decorated_function
        return decorator


​    
    def admin_required(f):
        return permission_required(Permission.ADMINISTER)(f)


​    

`app.main/views.py`


​    
    @main.route('/admin')
    @login_required
    @admin_required
    def for_admins_only():
        return "管理员用户界面"


​    
    @main.route('/moderator')
    @login_required
    @permission_required(Permission.MODERATE_COMMENTS)
    def for_moderator_only():
        return "操作员用户界面"


`app/main/__init__.py`


​    
    from flask import Blueprint
    from ..models import Permission
    
    main = Blueprint('main', __name__)  # param 1：蓝本的名字，param 2：蓝本所在的包或模块


​    
    @main.app_context_processor            # 使用上下文处理器，让变量在所有模板中全局可访问
    def inject_permissions():
        return dict(Permission=Permission)


​    
    from . import views, errors


`tests/test_user_model.py`


​    
    import unittest
    import time
    from app import create_app, db
    from app.models import User, AnonymousUser, Role, Permission


​    
    class UserModelTestCase(unittest.TestCase):
        def setUp(self):
            self.app = create_app('testing')
            self.app_context = self.app.app_context()
            self.app_context.push()
            db.create_all()
            Role.insert_roles()
    
        def tearDown(self):
            db.session.remove()
            db.drop_all()
            self.app_context.pop()
    
        def test_roles_and_permissions(self):
            u = User(email='john@163.com', password='cat')
            self.assertTrue(u.can(Permission.WRITE_ARTICLES))
            self.assertFalse(u.can(Permission.MODERATE_COMMENTS))
    
        def test_anonymous_user(self):
            u = AnonymousUser()
            self.assertFalse(u.can(Permission.FOLLOW))


​    
​    

## 9.5 效果展示

  1. 注册一个普通用户Dan@163.com后，数据库的存储情况 用户角色id为1，默认为普通用户 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210318105624.png)

  2. 普通用户登录后，试图访问`127.0.0.1:5000/admin` ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210318105737.png)

  3. 使用管理员邮箱注册，默认分配的用户角色id为3 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210318110018.png)

  4. 使用管理员账号，访问admin页面 

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210318110104.png)

