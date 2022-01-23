---
title: Flask学习之13 用户评论
date: 2021-03-27
permalink: /flask-learning-user-comment.html
tags:
 - Flask
categories:
 - Flask
---



# 13用户评论

## 13.1 前言

> 项目地址：https://gitee.com/guangmujun/micro-blog 个人网站：https://guangmujun.cn
> Flask Web学习：https://guangmujun.cn/archives/category/learning-note/flask-web
> MySQL学习：https://guangmujun.cn/archives/category/learning-note/mysql-note 参考：

## 13.2 评论在数据库中的表示

创建`comments`表，通过`author_id`与`users`建立联系，通过`post_id`建立与`posts`表的联系
`app/models.py`


​    
    class Comment(db.Model):
        __tablename__ = 'comments'
        id = db.Column(db.Integer, primary_key=True)
        body = db.Column(db.Text)
        timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
        body_html = db.Column(db.Text)
        disabled = db.Column(db.Boolean)
        author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
        post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    
        @staticmethod
        def on_changed_body(target, value, oldvalue, initiator):
            allowed_tags = ['a', 'abbr', 'acronym', 'b', 'blockquote', 'code',
                            'em', 'i', 'li', 'ol', 'pre', 'strong', 'ul',
                            'h1', 'h2', 'h3', 'p']
            target.body_html = bleach.linkify(bleach.clean(
                markdown(value, output_format='html'),
                tags=allowed_tags, strip=True))
    
    class User(UserMixin, db.Model):
        comments = db.relationship('Comment', backref='author', lazy='dynamic')     # 评论
    
    class Post(db.Model):
        comments = db.relationship('Comment', backref='post', lazy='dynamic')
    
    db.event.listen(Comment.body, 'set', Comment.on_changed_body)  


定义一个事件，在修改body字段内容时触发，自动把markdown文本转换成html 此处的评论也允许使用markdown语法

## 13.3 提交和显示评论

评论输入表单 `app/main/forms.py`


​    
    class CommentForm(FlaskForm):
        body = StringField('', validators=[DataRequired()])
        submit = SubmitField('提交')


`app/main/views.py`


​    
    @main.route('/post/<int:id>', methods=['GET', 'POST'])
    def post(id):
        post = Post.query.get_or_404(id)
        form = CommentForm()
        if form.validate_on_submit():
            comment = Comment(body=form.body.data,
                              post=post,
                              author=current_user._get_current_object())
            db.session.add(comment)
            db.session.commit()
            flash('你的评论已提交！')
            return redirect(url_for('.post', id=post.id))                   
        page = request.args.get('page', 1, type=int)
        pagination = post.comments.order_by(Comment.timestamp.desc()).paginate(
            page, per_page=current_app.config['FLASKY_COMMENTS_PER_PAGE'],
            error_out=False)
        comments = pagination.items
        return render_template('post.html', posts=[post], form=form,
                               comments=comments, pagination=pagination)


`app/templates/_comments.html`


​    
    <ul class="comments">
        {% for comment in comments %}
        <li class="comment">
            <div class="comment-thumbnail">
                <a href="{{ url_for('.user', username=comment.author.username) }}">
                    <img class="img-rounded profile-thumbnail" src="{{ comment.author.gravatar(size=40) }}">
                </a>
            </div>
            <div class="comment-content">
                <div class="comment-date">{{ moment(comment.timestamp).fromNow() }}</div>
                <div class="comment-author"><a href="{{ url_for('.user', username=comment.author.username) }}">{{ comment.author.username }}</a></div>
                <div class="comment-body">
                    {% if comment.disabled %}
                    <p><i>此条评论已被管理员屏蔽，谢谢！</i></p>
                    {% endif %}
                    {% if moderate or not comment.disabled %}
                        {% if comment.body_html %}
                            {{ comment.body_html | safe }}
                        {% else %}
                            {{ comment.body }}
                        {% endif %}
                    {% endif %}
                </div>
                {% if moderate %}
                    <br>
                    {% if comment.disabled %}
                    <a class="btn btn-default btn-xs" href="{{ url_for('.moderate_enable', id=comment.id, page=page) }}">显示</a>
                    {% else %}
                    <a class="btn btn-danger btn-xs" href="{{ url_for('.moderate_disable', id=comment.id, page=page) }}">不显示</a>
                    {% endif %}
                {% endif %}
            </div>
        </li>
        {% endfor %}
    </ul>


​    

`app/templates/_posts.html`


​    
    <a href="{{ url_for('.post', id=post.id) }}#comments">
        <span class="label label-primary">{{ post.comments.count() }} 评论</span>
    </a>


`app/tempaltes/post.html`


​    
    {% extends "base.html" %}
    {% import "_macros.html" as macros %}
    {% import "bootstrap/wtf.html" as wtf %}
    
    {% block title %}Flasky - 文章{% endblock%}
    
    {% block page_content %}
    {% include '_posts.html' %}
    <h4 id="comments">评论</h4>
    {% if current_user.can(Permission.COMMENT) %}
    <div class="comment-form">
        请写下你的评论：
        {{ wtf.quick_form(form) }}
    </div>
    {% endif %}
    {% include '_comments.html' %}
    {% if pagination %}
    <div class="'paginaiton">
        {{ macros.pagination_widget(pagination, '.post', fragment='#comments', id=posts[0].id) }}
    </div>
    {% endif %}
    {% endblock %}
    
    {% block scripts %}
    {{ super() }}
    {{ pagedown.include_pagedown() }}
    {% endblock %}


`app/templates/_macros.html`


​    
    {% macro pagination_widget(pagination, endpoint, fragment='') %}
    <ul class="pagination">
        <li {% if not pagination.has_prev %} class="disabled"{% endif %}>
            <a href="{% if pagination.has_prev %}{{ url_for(endpoint,
                page = pagination.page - 1, **kwargs) }}{{ fragment }}{% else %}#{% endif %}">«</a>
        </li>
        {% for p in pagination.iter_pages() %}
            {% if p %}
                {% if p == pagination.page %}
                <li class="active">
                    <a href="{{ url_for(endpoint, page = p, **kwargs) }}{{ fragment }}">{{p}}</a>
                </li>
                {% else %}
                <li>
                    <a href="{{ url_for(endpoint, page = p, **kwargs) }}{{ fragment }}">{{p}}</a>
                </li>
                {% endif %}
            {% else %}
                <li class="disabled"><a href="#">…</a></li>
            {% endif %}
        {% endfor %}
        <li {% if not pagination.has_next %} class="disabled"{% endif %}>
            <a href="{% if pagination.has_next %}{{ url_for(endpoint,
               page = pagination.page + 1, **kwargs) }}{{ fragment }}{% else %}#{% endif %}">»</a>
        </li>
    </ul>
    {% endmacro %}


​    

URL 片段

  * 在文章的固定链接后面加上#comments后缀
  * 用于指定加载页面后滚动条所在的初始位置
  * `post.html`中`<h4 id="comments">评论</h4>`,`fragment`参数值设置为`#comments`，则滚动条会处在h4标题所在的位置

## 13.4 管理评论

添加【评论管理】菜单 `app/templates/base.html`


​    
    {% if current_user.can(Permission.MODERATE_COMMENTS) %}
    <li><a href="{{ url_for('main.moderate') }}">评论管理</a></li>
    {% endif %}


`app/main/views.py`


​    
    @main.route('/moderate')
    @login_required
    @permission_required(Permission.MODERATE_COMMENTS)
    def moderate():
        page = request.args.get('page', 1, type=int)
        pagination = Comment.query.order_by(Comment.timestamp.desc()).paginate(
            page, per_page=current_app.config['FLASKY_COMMENTS_PER_PAGE'],
            error_out=False)
        comments = pagination.items
        return render_template('moderate.html', comments=comments,
                               pagination=pagination, page=page)


`app/templates/moderate.html`


​    
    {% extends "base.html" %}
    {% import "_macros.html" as macros %}
    
    {% block title %}Flasky - 评论管理{% endblock%}
    
    {% block page_content %}
    <div class="page-header">
        <h1>评论管理</h1>
    </div>
    {% set moderate = True %}
    {% include '_comments.html' %}
    {% if pagination %}
    <div class="'paginaiton">
        {{ macros.pagination_widget(pagination, '.moderate') }}
    </div>
    {% endif %}
    {% endblock %}


​    

设置了`moderate`标志，用在`_comments.html`模板中，决定是否渲染评论管理功能
`app/templates/_comments.html`


​    
    <ul class="comments">
        {% for comment in comments %}
        <li class="comment">
            <div class="comment-thumbnail">
                <a href="{{ url_for('.user', username=comment.author.username) }}">
                    <img class="img-rounded profile-thumbnail" src="{{ comment.author.gravatar(size=40) }}">
                </a>
            </div>
            <div class="comment-content">
                <div class="comment-date">{{ moment(comment.timestamp).fromNow() }}</div>
                <div class="comment-author"><a href="{{ url_for('.user', username=comment.author.username) }}">{{ comment.author.username }}</a></div>
                <div class="comment-body">
                    {% if comment.disabled %}
                    <p><i>此条评论已被管理员屏蔽，谢谢！</i></p>
                    {% endif %}
                    {% if moderate or not comment.disabled %}
                        {% if comment.body_html %}
                            {{ comment.body_html | safe }}
                        {% else %}
                            {{ comment.body }}
                        {% endif %}
                    {% endif %}
                </div>
                {% if moderate %}
                    <br>
                    {% if comment.disabled %}
                    <a class="btn btn-default btn-xs" href="{{ url_for('.moderate_enable', id=comment.id, page=page) }}">显示</a>
                    {% else %}
                    <a class="btn btn-danger btn-xs" href="{{ url_for('.moderate_disable', id=comment.id, page=page) }}">不显示</a>
                    {% endif %}
                {% endif %}
            </div>
        </li>
        {% endfor %}
    </ul>


​    

`app/main/views.py`


​    
    @main.route('/moderate/enable/<int:id>')
    @login_required
    @permission_required(Permission.MODERATE_COMMENTS)
    def moderate_enable(id):
        comment = Comment.query.get_or_404(id)
        comment.disabled = False
        db.session.add(comment)
        return redirect(url_for('.moderate',
                                page=request.args.get('page', 1, type=int)))


​    
    @main.route('/moderate/disable/<int:id>')
    @login_required
    @permission_required(Permission.MODERATE_COMMENTS)
    def moderate_disable(id):
        comment = Comment.query.get_or_404(id)
        comment.disabled = True
        db.session.add(comment)
        return redirect(url_for('.moderate',
                                page=request.args.get('page', 1, type=int)))


效果 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210327152459.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210327152522.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210327152549.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210327152610.png)

