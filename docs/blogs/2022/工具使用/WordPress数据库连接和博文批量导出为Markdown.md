---
title: WordPress数据库连接和博文批量导出为Markdown
date: 2022-01-26
permalink: /2022/工具使用/tool-use-wordpress-mysql-python-markdown.html
tags:
 - 工具
 - WordPress
 - MySQL
 - Markdown
categories:
 - 工具
---

## 步骤
1、连接服务器上的MySQL
2、导出MySQL中文章数据
3、数据转化为Markdown格式

## 连接MySQL
1、数据库密码忘记处理
- 登陆到服务器，修改配置文件`/etc/my.cnf`
- 在`[mysqld]`下方加入`skip-grant-tables`
- 保存退出，重启MySQL服务, `service mysqld restart`

2、修改数据库密码
```shell
mysql> use mysql;
Database changed

mysql> update user set password = password ('new-password') where user = 'root';
Query OK, 4 rows affected (0.00 sec)
Rows matched: 4  Changed: 4  Warnings: 0

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)

mysql> quit;
```

## 导出MySQL数据
1、客户端工具DBeaver远程连接数据库
2、查询文章标题、时间、分类、内容
```SQL
select 
    p.post_title,p.post_date, t.name,p.post_content_filtered 
from wp_posts p, wp_term_relationships r,wp_terms t, wp_term_taxonomy tt 
    where p.id=r.object_id 
    and r.term_taxonomy_id=t.term_id 
    and tt.term_id=t.term_id 
    and tt.taxonomy='category'
;
```
3、导出结果数据集为CSV
4、（可选）使用SQL语句导出查询内容为CSV,需要配置`--secure-file-priv`
- 在配置文件`/etc/my.cnf`的`[mysqld]`下方添加`secure_file_priv = /tmp`
- 使用下述SQL语句导出查询结果为CSV，存储到服务器上
```SQL
select 
    p.post_title,p.post_date, t.name,p.post_content_filtered 
from wp_posts p, wp_term_relationships r,wp_terms t, wp_term_taxonomy tt 
    where p.id=r.object_id 
    and r.term_taxonomy_id=t.term_id 
    and tt.term_id=t.term_id 
    and tt.taxonomy='category'
INTO OUTFILE 'tmp/data.csv' 
FIELDS ENCLOSED BY '"' 
TERMINATED BY ',' 
ESCAPED BY '"' 
LINES TERMINATED BY '\n';
```

## 转化为Markdown
1、从数据库中导出的文档内容为html格式，需要将其转化为Markdown文件进行保存
- 安装Python的第三方库`pip install html2text`
- Python脚本实现批量转换
```python
import os
import csv
import sys
import html2text

csv.field_size_limit(sys.maxsize)
WORK_DIR = os.getcwd()


def set_post_dir():
    # create category dir
    post_dir = os.path.join(WORK_DIR, category)
    if not os.path.exists(post_dir):
        os.mkdir(post_dir)
    os.chdir(post_dir)


with open('posts.csv', newline='') as csvfile:
    posts = csv.reader(csvfile)
    for post in posts:
        if post[1] == "name":  # skip first line
            continue
        post_title, post_date, category, post_content = post

        set_post_dir()

        try:
            with open(post_title+".md", "w") as post_file:
                post_file.write(post_title+"\n")
                post_file.write(str(post_date.split(" ")[0])+"\n")
                post_content_md = html2text.html2text(post_content)
                post_file.write(post_content_md)
        except Exception as exp:
            print(exp)
            print(f"category: {category}")
            print(f"title: {post_title}")
            print(f"content: {post_content}")
```
2、Python脚本执行完后，在本地按照文章类别新建文件夹，并在各自文件夹内，每篇文章生成一个Markdown文件

## 问题
第三方库将html转化为markdown还是会存在一点小问题，转化的不完美。

## 参考
> - https://blog.csdn.net/MerlinMa2019/article/details/106936627
> - https://www.yiibai.com/mysql/export-table-to-csv.html
> - https://zhuanlan.zhihu.com/p/442459845

