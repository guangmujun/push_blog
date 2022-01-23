---
title: Flask学习之11博客文章
date: 2021-03-25
permalink: /flask-learning-blog-article.html
tags:
 - Flask
categories:
 - Flask

---

# 11博客文章

## 11.1 前言

> 项目地址：https://gitee.com/guangmujun/micro-blog 个人网站：https://guangmujun.cn
> Flask Web学习：https://guangmujun.cn/archives/category/learning-note/flask-web
> MySQL学习：https://guangmujun.cn/archives/category/learning-note/mysql-note 参考：

## 11.2 提交和显示博客文章

`app/models.py`

 ```python
     class Post(db.Model):
 ​        __tablename__ = 'posts'
 ​        id = db.Column(db.Integer, primary_key=True)
 ​        body = db.Column(db.Text)
 ​        timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
 ​        author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
 ```




`app/main/forms.py`

```python
  class PostForm(FlaskForm):
​        body = TextAreaField('写点什么吧？', validators=[DataRequired()])
​        submit = SubmitField('提交')
```




`app/main/views.py`

```python
@main.route('/', methods=['GET', 'POST'])
​    def index():
​        form = PostForm()
​        if current_user.can(Permission.WRITE_ARTICLES) and form.validate_on_submit():
​            post = Post(body=form.body.data, author=current_user.__get_current_object())
​            db.session.add(post)
​            return redirect(url_for('.index'))
​        posts = Post.query.order_by(Post.timestamp.desc()).all()
​        return render_template('index.html', form=form, posts=posts)
```




`app/templates/index.html`


    {% extends "base.html" %}
    {% import "bootstrap/wtf.html" as wtf %}
    {% block title %}Flasky - 首页{% endblock %}
    {% block page_content %}
    <div class="page_content">
        <div class="page-header">
            <h1>你好, {% if current_user.is_authenticated %}{{ current_user.username|capitalize }}{% else %}陌生人{% endif %}!</h1>
        </div>
        <div>
            {% if current_user.can(Permission.WRITE_ARTICLES) %}
            {{ wtf.quick_form(form) }}
            {% endif %}
        </div>
        <ul class="posts">
            {% for post in posts %}
            <li class="post">
                <div class="post-thumbnail">
                    <a href="{{ url_for('.user'), username=post.author.username }}">
                        <img class="img-rounded profile-thumbnail" src="{{ post.author.gravatar(size=40) }}">
                    </a>
                </div>
                <div class="post-date">{{ moment(post.timestamp).fromNow() }}</div>
                <div class="post-author">
                    <a href="{{ url_for('.user'), username=post.author.username }}">
                        {{ post.author.username }}
                    </a>
                </div>
                <div class="post-body">{{ post.body }}</div>
            </li>
            {% endfor %}
        </ul>
    </div>
    {% endblock %}


## 11.3 在资料页中显示博客文章

`app/main/views.py`

```python
   @main.route('/user/<username>')
​    def user(username):
​        user = User.query.filter_by(username=username).first()
​        if user is None:
​            abort(404)
​        posts = user.posts.order_by(Post.timestamp.desc()).all()
​        return render_template('user.html', user=user, posts=posts)
```




`app/templates/user.html`

```html
    
    <h3>{{ user.username}}的文章：</h3>
    {% include '_posts.html' %}
```



Jinjia2提供include()指令，可以使user.html模板中包含_posts.html中定义的列表，模板名称中的下划线不是必须的，习惯用法，区域独立模块和局部模块
`app/templates/_posts.html`

         <ul class="posts">
            {% for post in posts %}
            <li class="post">
                <div class="post-thumbnail">
                    <a href="{{ url_for('.user'), username=post.author.username }}">
                        <img class="img-rounded profile-thumbnail" src="{{ post.author.gravatar(size=40) }}">
                    </a>
                </div>
                <div class="post-content">
                    <div class="post-date">{{ moment(post.timestamp).fromNow() }}</div>
                    <div class="post-author">
                        <a href="{{ url_for('.user'), username=post.author.username }}">
                            {{ post.author.username }}
                        </a>
                    </div>
                    <div class="post-body">
                        {{ post.body }}
                    </div>
                </div>
        
     </li>
        {% endfor %}
    </ul>




`app/tempaltes/index.html`

  ```html
    {% block page_content %}
      <div class="page-header">
          <h1>你好, {% if current_user.is_authenticated %}{{ current_user.username|capitalize }}{% else %}陌生人{% endif %}!</h1>
      </div>
      <div>
          {% if current_user.can(Permission.WRITE_ARTICLES) %}
          {{ wtf.quick_form(form) }}
          {% endif %}
      </div>
      <div class="post-tabs">
          {% include '_posts.html' %}
      </div>
      {% endblock %}
  ```




## 11.4 分页显示长博客文章列表

分页显示数据，进行片段式渲染

### 11.4.1 创建虚拟博客文章数据

两种方式，分别是使用ForgertPy和faker包 faker包使用起来要更简洁一些，推荐！

  1. **ForgertPy包**

自动化生成测试数据 ForgeryPy，用于生成虚拟信息 安装

```shell
  conda install forgerypy
```




由于此Python包，只是在开发环境中使用，所以requirements文件需要修改

  * 创建requirements文件夹
  * common.txt保存开发环境和生产环境都使用的依赖
  * dev.txt导入common.txt中的依赖，然后增加开发环境的依赖
  * prod.txt导入common.txt中的依赖，然后增加生产环境的依赖

`dev.txt`内容示例：


​    -r common.txt
​    ForgeryPy==0.1


`app/models.py`


​    

​    
          ​    class User(UserMixin, db.Model):
    ​        posts = db.relationship('Post', backref='author', lazy='dynamic')           # 文章内容
    ​    
            @staticmethod
            def generate_fake(count=100):
                from sqlalchemy.exc import IntegrityError  # 异常：随机生成的邮箱或用户名重复
                from random import seed
                import forgery_py
          seed()
            for i in range(count):
                u = User(email=forgery_py.internet.email_address(),
                         username=forgery_py.internet.user_name(),
                         password=forgery_py.lorem_ipsum.word(),
                         confirmed=True,
                         name=forgery_py.name.full_name(),
                         location=forgery_py.address.city(),
                         about_me=forgery_py.lorem_ipsum.sentence(),
                         member_since=forgery_py.date.date(True))
                db.session.add(u)
                try:
                    db.session.commit()
                except IntegrityError:
                    db.session.rollback()  # 遇到异常，在继续操作之前回滚会话（生成的用户总数可能会比预期少）


注意要在User中加入posts字段，其在Post中会反向创建`author`的虚拟字段

```python
    
​    class Post(db.Model):
​        __tablename__ = 'posts'
​        id = db.Column(db.Integer, primary_key=True)
​        body = db.Column(db.Text)
​        timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
​        author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
​    
        @staticmethod
        def generate_fake(count=100):
            from random import seed, randint  # randint(a, b)生成[a,b]区间内的随机整数
            import forgery_py
    
```



            seed()
            user_count = User.query.count()
            for i in range(count):
                u = User.query.offset(randint(0, user_count - 1)).first()  # 随机指定一名用户
                p = Post(body=forgery_py.lorem_ipsum.sentences(randint(1, 3)),
                         timestamp=forgery_py.date.date(True),
                         author=u)
                db.session.add(p)
                db.session.commit()


`offset()`查询过滤器，会跳过参数中指定的记录数量，通过设定一个随机的偏移值，再调用first()方法，就能够每次都获得一个不同的随机用户。
生成随机用户：【运行之前记得迁移和更新数据库】


​    
​    >>> User.generate_fake(100)
​    >>> Post.generate_fake(100)


遇到的小问题：

```shell
    >>> Post.generate_fake(10)
​    >>> Traceback (most recent call last):
​      File "<console>", line 1, in <module>
​    NameError: name 'Post' is not defined
```




解决： `app/manage.py`

```python
    
​    from app.models import User, Role, Post
​    
    def make_shell_context():
        return dict(app=app, db=db, User=User, Role=Role, Post=Post)
   
```




  2. **faker包**

`app/fake.py`

```python
  from random import randint
​    from sqlalchemy.exc import IntegrityError
​    from faker import Faker
​    from . import db
​    from .models import User, Post


​    
​    def users(count=100):
​        fake = Faker()
​        i = 0
​        while i < count:
​            u = User(email=fake.email(),
​                     username=fake.user_name(),
​                     password='password',
​                     confirmed=True,
​                     name=fake.name(),
​                     location=fake.city(),
​                     about_me=fake.text(),
​                     member_since=fake.past_date())
​            db.session.add(u)
​            try:
​                db.session.commit()
​                i += 1
​            except IntegrityError:
​                db.session.rollback()  # 遇到异常，在继续操作之前回滚会话（生成的用户总数可能会比预期少）


​    
​    def posts(count=100):
​        fake = Faker()
​        user_count = User.query.count()
​        for i in range(count):
​            u = User.query.offset(randint(0, user_count - 1)).first()
​            p =  Post(body=fake.text(),
​                      timestamp=fake.past_date(),
​                      author=u)
​            db.session.add(p)
​        db.session.commit()
```



使用：【运行之前记得迁移和更新数据库】


​    
​    >>> from app import fake
​    >>> fake.users(100)
​    >>> fake.posts(100)


### 11.4.2 在页面中渲染数据

`app/main/views.py`

```python
  @main.route('/', methods=['GET', 'POST'])
​    def index():
​        form = PostForm()
​        if current_user.can(Permission.WRITE_ARTICLES) and form.validate_on_submit():
​            post = Post(body=form.body.data, author=current_user.__get_current_object())  # 真正的用户对象
​            db.session.add(post)
​            return redirect(url_for('.index'))
​        page = request.args.get('page', 1, type=int)                                        # 渲染的页数，默认渲染第一页
​        pagination = Post.query.order_by(Post.timestamp.desc()).paginate(                   # 参数page，页数
​            page, per_page=current_app.config['FLAKSY_POSTS_PER_PAGE'], error_out=False     # 可选参数per_page每页的记录数
​        )                                                                                   # 可选参数error_out，False，超出范围返回空列表
​        posts = pagination.items
​        return render_template('index.html', form=form, posts=posts, pagination=pagination)
```




通过http://127.0.0.1:5000/?page=2使用page参数访问分页

### 11.4.3 添加分页导航

`paginate()`方法的返回值是一个`Pagination`类对象

  * 具有的属性： 
    * items，当前页面中的记录
    * query，分页的源查询
    * page，当前页数
    * prev_num,上一页的页数
    * next_num，下一页的页数
    * has_next,如果有下一页，值为True
    * has_prev，如果有上一页，值为True
    * pages，查询得到的总页数
    * per_page，每页显示的记录数量
    * total，查询返回的记录总数
  * 具有的方法： 
    * iter_pages()，一个迭代器，返回一个在分页导航中显示的页数列表

    * left_edge=2

    * left_current=2
    * right_current=5
    * right_edge=2

举例子： 在一个100页的列表中，当前页为50页，如果使用上述的默认配置，则会返回以下页数


        1、2、None、48、49、50、51、52、53、54、55、None、99、100


    * prev()，上一页的分页对象
    
    * next()，下一页的分页对象

`app/templates/_macros.html`


 ```html
    {% macro pagination_widget(pagination, endpoint) %}
     <ul class="pagination">
         <li {% if not pagination.has_prev %} class="disabled"{% endif %}>
             <a href="{% if pagination.has_prev %}{{ url_for(endpoint,
                 page = pagination.page - 1, **kwargs) }}{% else %}#{% endif %}">&laquo</a>
         </li>
         {% for p in pagination.iter_pages() %}
             {% if p %}
                 {% if p == pagination.page %}
                 <li class="active">
                     <a href="{{ url_for(endpoint, page = p, **kwargs) }}">{{p}}</a>
                 </li>
                 {% else %}
                 <li>
                     <a href="{{ url_for(endpoint, page = p, **kwargs) }}">{{p}}</a>
                 </li>
                 {% endif %}
             {% else %}
                 <li class="disabled"><a href="#">…</a></li>
             {% endif %}
         {% endfor %}
         <li {% if not pagination.has_next %} class="disabled"{% endif %}>
             <a href="{% if pagination.has_next %}{{ url_for(endpoint,
                page = pagination.page + 1, **kwargs) }}{% else %}#{% endif %}">»</a>
         </li>
     </ul>
     {% endmacro %}
 
 
 
 ```

​    

  * `macro`，宏，相当于函数，这里定义了名为`pagination_widget()`的函数，有两个参数`pagination`,`endpoint`
  * `url_for()`中有两个参数，端点`endpoint`，`page`参数用于指定显示哪一页
  * `href="#"`，表示链接当前页
  * `&laquo;`表示向左的箭头，`&raquo;`表示向右的箭头
  * `pagination.iter_pages()`返回显示的导航列表

`app/templates/index.html`

      {% import "_macros.html" as macros %}
        {% if pagination %}
    <div class="pagination">
        {{ macros.pagination_widget(pagination, '.index') }}
    </div>
    {% endif %}


### 11.4.4 博客文章显示效果

  1. 打开页面 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210325164724.png)

  2. 点击第8页效果 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210325164801.png)

  3. 点击一个用户的用户名或者头像 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210325164842.png)

## 11.5 使用Markown和Flask-PageDown支持富文本文章

支持MarkDown语法，添加富文本文章的预览功能 相关的包：

  * PageDown：转换MarkDown到HTML
  * Flask-PageDown：将PageDown集成到Flask-WTF表单中
  * Markdown：使用Python实现的服务器端Markdown到HTML转换程序
  * Bleach：使用Python实现的HTML清理程序

安装

```shell
 conda install flask-pagedown markdown bleach
```




### 11.5.1 使用Flask-PageDown

`app/__init__.py`初始化扩展

```python
 from flask_pagedown import PageDown
​    
    pagedown = PageDown()
```

​    

    def create_app(config_name):
        pagedown.init_app(app)


Flask-PageDown扩展定义了一个PageDownField类，这个类和WTForms中的TextAreaField接口一致。
将首页中的多行文本控件转换成Markdown富文本编辑器，修改PostForm中的body字段 `app/main/forms.py`


```python    from flask_pagedown.fields import PageDownField
    
    class PostForm(FlaskForm):
        body = PageDownField('写点什么吧？', validators=[DataRequired()])
        submit = SubmitField('提交')
```


使用`PageDown`库生成Markdown预览 `app/templates/index.html`


```html
    {% block scripts %}
    {{ super() }}
    {{ pagedown.include_pagedown() }}
    {% endblock %}
```




效果： ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210325170743.png)

### 11.5.2 在服务器端处理富文本

如下图所示，提交后，存储的是markdown语法，显示的也直接是语法内容 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210325171820.png) 直接提交HTML预览，有安全隐患，
所以，安全起见，应该提交markdown源文本，再然后在服务器上使用`Markdown`包将其转换成HTML，再使用`Bleach`进行清理，确保其中只包含几个允许使用的HTML标签。
怎么做？

  * 创建文章时，做一次性转换，把结果缓存在数据库中
  * 转换后的博客文章HTML代码缓存在Post模型的一个新字段中，在模板中可直接调用
  * 文章的Markdown源文本还要保存在数据库中

`app/models.py`

    ```python
       from markdown import markdown
    ​    import bleach
    ​    
        class Post(db.Model):
            __tablename__ = 'posts'
            id = db.Column(db.Integer, primary_key=True)
            body = db.Column(db.Text)
            timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
            author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
            body_html = db.Column(db.Text)
        
    ```



        @staticmethod
        def on_changed_body(target, value, oldvalue, initiator):
            allowed_tags = ['a', 'abbr', 'acronym', 'b', 'blockquote', 'code',
                            'em', 'i', 'li', 'ol', 'pre', 'strong', 'ul',
                            'h1', 'h2', 'h3', 'p']
            target.body_html = bleach.linkify(bleach.clean(
                markdown(value, output_format='html'),
                tags=allowed_tags, strip=True))
    
    db.event.listen(Post.body, 'set', Post.on_changed_body)


`SQLAlchemy`“set”事件的监听程序，只要body字段设置了新值，函数就会自动被调用 `app/templates/_posts.html`


  ```html
    <div class="post-body">
          {% if post.body_html %}
          {{ post.body_html|safe }}
          {% else %}
          {{ post.body }}
          {% endif %}
      </div>
  ```



`safe`后缀，让`Jinjia2`不要转义HTML元素 效果： ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210325174142.png) 网址可以转换，但是图片显示暂时不行！

## 11.6 博客文章的固定链接

`app/main/views.py`

```python
    @main.route('/post/<int:id>')
​    def post(id):
​        post = Post.query.get_or_404(id)
​        return render_template('post.html', posts=[post])
```






在_posts.html中加入文章的固定链接 `app/templates/_posts.html`


```html
    <div class="post-footer">
        <a href="{{ url_for('.post', id=post.id) }}">
            <span class="label label-default">文章链接</span>
        </a>
    </div>
```



`app/templates/post.html`

      {% extends "base.html" %}
        {% block title %}Flasky - 文章{% endblock%}
    {% block page_content %}
    {% include '_posts.html' %}
    {% endblock %}


效果 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210325200551.png)

## 11.7 博客文章编辑器

让用户编辑自己的文章，显示在单独的页面 `app/templates/edit_post.html`

    {% extends "base.html" %}
    {% import "bootstrap/wtf.html" as wtf %}
    {% block title %}Flasky - 文章编辑{% endblock%}
    {% block page_content %}
    <div class="page-header">
        <h1>编辑文章</h1>
    </div>
    <div>
        {{ wtf.quick_form(form) }}
    </div>
    {% endblock %}
    
    {% block scripts %}
    {{ super() }}
    {{ pagedown.include_pagedown() }}
    {% endblock %}


显示markdown文本和预览效果 `app/main/views.py`


```python
    @main.route('/edit/<int:id>', methods=['GET', 'POST'])
​    @login_required
​    def edit(id):
​        post = Post.query.get_or_404(id)
​        if current_user != post.author and not current_user.can(Permission.ADMINISTER):  # 当前用户和管理员可以编辑文章
​            abort(403)
​        form = PostForm()
​        if form.validate_on_submit():
​            post.body = form.body.data
​            db.session.add(post)
​            db.session.commit()
​            flash('文章已经更新！')
​        form.body.data = post.body
​        return render_template('edit_post.html', form=form)
```




编辑按钮 `app/templates/_posts.html`


```html
    <div class="post-footer">
        {% if current_user == post.author %}
        <a href="{{ url_for('.edit', id=post.id) }}">
            <span class="label label-primary">编辑</span>
        </a>
        {% elif current_user.is_administrator() %}
        <a href="{{ url_for('.post', id=post.id) }}">
            <span class="label label-primary">编辑（管理员）</span>
        </a>
        {% endif %}
        <a href="{{ url_for('.post', id=post.id) }}">
            <span class="label label-primary">文章链接</span>
        </a>
    </div>
```




效果

  1. 首页 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210325202251.png)

  2. 点击文章链接 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210325202317.png)

  3. 点击编辑 

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210325202335.png)

