---
title: Flask学习之12 关注者
date: 2021-03-26
permalink: /flask-learning-follwer.html
tags:
 - Flask
categories:
 - Flask

---



# 12关注者

## 12.1 前言

> 项目地址：https://gitee.com/guangmujun/micro-blog 个人网站：https://guangmujun.cn
> Flask Web学习：https://guangmujun.cn/archives/category/learning-note/flask-web
> MySQL学习：https://guangmujun.cn/archives/category/learning-note/mysql-note 参考：

让用户关注其他用户，并在首页只显示所关注用户发布的文章列表

## 12.2 数据库关系

### 12.1.1 多对多关系

使用关联表

### 12.1.2 自引用关系

如果关系中的两侧都在同一个表中，这种关系称为自引用关系。 关联表follows：

  * 每一行表示一个用户关注了另一个用户
  * followe_id 关注了 followed_id

### 12.1.3 高级多对多关系

存储所连两个实体之间的额外信息。 比如， 存储用户关注另一个用户的日期。 `app/models.py`


​    
    class Follow(db.Model):
        __tablename__ = 'follows'
        follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)  # 关注者的id
        followed_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)  # 被关注者的id
        timestamp = db.Column(db.DateTime, default=datetime.utcnow)                       # 关注的时间


将这个多对多关系的左右两侧拆分成两个基本的一对多关系，而且要定义成标准的关系。 **这块有些不大明白！！！！！！！！** `app/models.py`


​    
    class User(UserMixin, db.Model):
        __tablename__ = 'users'
    
        followed = db.relationship('Follow',                                        # 关注的用户
                                   foreign_keys=[Follow.follower_id],
                                   backref=db.backref('follower', lazy='joined'),
                                   lazy='dynamic',
                                   cascade='all,delete-orphan')
        followers = db.relationship('Follow',                                       # 粉丝
                                    foreign_keys=[Follow.followed_id],
                                    backref=db.backref('followed', lazy='joined'),
                                    lazy='dynamic',
                                    cascade='all,delete-orphan')


follower，关注者，我的关注者是关注我的人 followed，被关注者，我的被关注者是我关注的人 `app/models.py`


​    
    class User(UserMixin, db.Model):
    
        def follow(self, user):
            """
            自己关注某个用户
            :param user:
            :return:
            """
            if not self.is_following(user):                 # 先看是不是已经关注了，没关注的话
                f = Follow(follower=self, followed=user)    # 自己是关注者，user是被关注者
                db.session.add(f)
    
        def unfollow(self, user):
            """
            自己取消关注某个用户
            :param user:
            :return:
            """
            f = self.followed.filter_by(followed_id=user.id).first()  # 看看自己的followed中是否有user
            if f:
                db.session.delete(f)                                  # 有的话，删除
    
        def is_following(self, user):
            """
            检查自己是否已经关注了某个用户
            :param user:
            :return:
            """
            if user.id is None:
                return False
            return self.followed.filter_by(followed_id=user.id).first() is not None  # 查询用户id是否在followed_id中
    
        def is_followed_by(self, user):
            """
            检查自己是否已经被某个用户关注
            :param user:
            :return:
            """
            if user.id is None:
                return False
            return self.followers.filter_by(follower_id=user.id).first() is not None  # 看自己的关注者列表中是否有user


​    
​    

## 12.3 在资料页面中显示关注者

`app/tempaltes/user.html`


​    
    <p>
        {% if current_user.can(Permission.FOLLOW) and user != current_user %}
        {% if not current_user.is_following(user) %}
        <a href="{{ url_for('.follow', username=user.username) }}" class="btn btn-primary">关注</a>
        {% else %}
        <a href="{{ url_for('.unfollow', username=user.username) }}" class="btn btn-default">取消关注</a>
        {% endif %}
        {% endif %}
        <a href="{{ url_for('.followers', username=user.username) }}">粉丝： <span class="badge">{{ user.followers.count() - 1 }}</span></a>
        <a href="{{ url_for('.followed_by', username=user.username) }}">关注： <span class="badge">{{ user.followed.count() - 1 }}</span></a>
        {% if current_user.is_authenticated and user != current_user and user.is_following(current_user) %}
        | <span class="label label-default">关注了你</span>
        {% endif %}
    </p>


`app/main/views.py`


​    
    @main.route('/followed_by/<username>')
    def followed_by(username):
        user = User.query.filter_by(username=username).first()
        if user is None:
            flash("无效的用户!")
            return redirect(url_for('.index'))
        page = request.args.get('page', 1, type=int)
        pagination = user.followed.paginate(
            page, per_page=current_app.config['FLAKSY_POSTS_PER_PAGE'],
            error_out=False)
        follows = [{'user': item.followed, 'timestamp': item.timestamp} for item in pagination.items]
        return render_template('followers.html', user=user, title="关注",
                               endpoint='.followed_by', pagination=pagination,
                               follows=follows)


​    
    @main.route('/followers/<username>')
    def followers(username):
        user = User.query.filter_by(username=username).first()
        if user is None:
            flash("无效的用户!")
            return redirect(url_for('.index'))
        page = request.args.get('page', 1, type=int)
        pagination = user.followers.paginate(
            page, per_page=current_app.config['FLAKSY_POSTS_PER_PAGE'],
            error_out=False)
        follows = [{'user':item.follower, 'timestamp': item.timestamp} for item in pagination.items]
        return render_template('followers.html', user=user, title="粉丝",
                               endpoint='.followers', pagination=pagination,
                               follows=follows)


​    
    @main.route('/unfollow/<username>')
    @login_required
    @permission_required(Permission.FOLLOW)
    def unfollow(username):
        user = User.query.filter_by(username=username).first()
        if user is None:
            flash("无效的用户!")
            return redirect(url_for('.index'))
        if not current_user.is_following(user):
            flash("你没有关注此用户！")
            return redirect(url_for('.user', username=username))
        current_user.unfollow(user)
        db.session.commit()
        flash('你取消关注了 {username} !'.format(username=username))
        return redirect(url_for('.user', username=username))


​    
    @main.route('/follow/<username>')
    @login_required
    @permission_required(Permission.FOLLOW)
    def follow(username):
        user = User.query.filter_by(username=username).first()
        if user is None:
            flash("无效的用户!")
            return redirect(url_for('.index'))
        if current_user.is_following(user):
            flash("你已关注此用户！")
            return redirect(url_for('.user', username=username))
        current_user.follow(user)
        db.session.commit()
        flash('你关注了 {username} !'.format(username=username))
        return redirect(url_for('.user', username=username))


效果： ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210326203002.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210326203019.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210326203030.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210326203055.png)

## 12.4 使用数据库联结查询所关注用户的文章

添加一个功能：能查看所关注用户发布的文章 基本思路：

  * 获取关注的用户
  * 获取各用户的文章
  * 将文章排序写入一个列表

存在的问题：

  * 伸缩性不好
  * 数据库的规模变大，则生成这个列表的工作量也不断增加
  * N+1问题

优化思路： 一次查询中完成所有操作—— **联结**

  * 在两个或多个数据表中，查找满足指定条件的记录组合
  * 再把记录组合插入一个临时表中，这个临时表就是联结查询的二级果

`app/models.py`


​    
    class User(UserMixin, db.Model):
    
        @property
        def followed_posts(self):
            """
            获取所关注用户的文章
            :return: 
            """
            return Post.query.join(Follow, Follow.followed_id == Post.author_id).filter(Follow.follower_id == self.id)


## 12.5 在首页示所关注用户的文章

`app/main/views.py`


​    
    @main.route('/', methods=['GET', 'POST'])
    def index():
        form = PostForm()
        if current_user.can(Permission.WRITE_ARTICLES) and form.validate_on_submit():
            post = Post(body=form.body.data, author=current_user._get_current_object())  # 真正的用户对象
            db.session.add(post)
            return redirect(url_for('.index'))
        page = request.args.get('page', 1, type=int)                                        # 渲染的页数，默认渲染第一页
        show_followed = False
        if current_user.is_authenticated:  # show_followed存在cookies中
            show_followed = bool(request.cookies.get('show_followed', ''))
        if show_followed:
            query = current_user.followed_posts  # 是显示关注的用户的文章
        else:
            query = Post.query                   # 显示所有文章
        pagination = query.order_by(Post.timestamp.desc()).paginate(                   # 参数page，页数
            page, per_page=current_app.config['FLAKSY_POSTS_PER_PAGE'], error_out=False     # 可选参数per_page每页的记录数
        )                                                                                   # 可选参数error_out，False，超出范围返回空列表
        posts = pagination.items
        return render_template('index.html', form=form, posts=posts, show_followed=show_followed, pagination=pagination)


​    

记得s`how_followed`参数要返传递 `app/main/views.py`


​    
    @main.route('/all')
    @login_required
    def show_all():
        resp = make_response(redirect(url_for('.index')))          # 创建响应对象
        resp.set_cookie('show_followed', '', max_age=30*24*60*60)  # 30天
        return resp


​    
    @main.route('/followed')
    @login_required
    def show_followed():
        resp = make_response(redirect(url_for('.index')))
        resp.set_cookie('show_followed', '1', max_age=30*24*60*60)
        return resp


`app/templates/index.html`


​    
    <div class="post-tabs">
        <ul class="nav nav-tabs">
            <li {% if not show_followed %} class="active"{% endif %}><a href="{{ url_for('.show_all') }}">全部</a></li>
            {% if current_user.is_authenticated %}
                <li {% if show_followed %} class="active"{% endif %}><a href="{{ url_for('.show_followed') }}">关注</a></li>
            {% endif %}
        </ul>
        {% include '_posts.html' %}
    </div>


出现的问题： 用户无法看到自己发布的文章，因为用户没有关注自己 解决： 创建用户时把用户设为自己的关注者 `app/models.py`


​    
    class User(UserMixin, db.Model):
    
        def __init__(self, **kwargs):
            super(User, self).__init__(**kwargs)                                    # 调用基类构造函数
            if self.role is None:
                if self.email == current_app.config['FLASKY_ADMIN']:                # 管理员
                    self.role = Role.query.filter_by(permissions=0xff).first()
                if self.role is None:
                    self.role = Role.query.filter_by(default=True).first()          # 用户
            if self.email is not None and self.avatar_hash is None:
                self.avatar_hash = hashlib.md5(self.email.encode('utf-8')).hexdigest()
            self.follow(self)      


或者直接添加一个实现相同功能的方法 **创建函数更新数据库，经常用来更新已部署的应用。**


​    
    @staticmethod
    def add_self_follows():  # 用户自己关注自己的方法
        for user in User.query.all():
            if not user.is_following(user):
                user.follow(user)
                db.session.add(user)
                db.session.commit()


运行：


​    
    >>> User.add_self_follows()


修改个人主页的关注和粉丝的数量 `app/templates/user.html`


​    
    <a href="{{ url_for('.followers', username=user.username) }}">粉丝：
        <span class="badge">
            {{ user.followers.count() - 1 }}
        </span>
    </a>
    <a href="{{ url_for('.followed_by', username=user.username) }}">关注：
        <span class="badge">
            {{ user.followed.count() - 1 }}
        </span>
    </a>


效果： ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210326221238.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210326221251.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210326221355.png)

