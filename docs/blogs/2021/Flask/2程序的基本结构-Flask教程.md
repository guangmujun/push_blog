---
title: Flask学习之2程序的基本结构
date: 2021-03-11
permalink: /flask-learning-base-program-structure.html
tags:
 - Flask
categories:
 - Flask

---



# 2 程序的基本结构

## 2.1 初始化


​    
    from flask import Flask  # 导入库
    app = Flask(__name__)    # Flask程序实例化


  1. 在Flask框架中，Web服务器使用WSGI协议把接收自客户端的请求都转给Flask类的对象处理

  2. 此处初始化的程序实例`app`，就是Flask类的对象

  3. `Flask()`为Flask类的构造函数，里面的参数`__name__`为必须指定的参数，表示程序的主模块或包的名字

  4. `__name__`是Python的一个内置类属性 

    * 当直接运行当前py文件（如`a.py`），`__name__`的值为`__main__`；
    * 当其他文件如`b.py`调`a.py`文件时，`__name__`就是`a.py`模块的名称，即`a`
    * [参考](https://blog.csdn.net/wosind/article/details/90728198)
  5. Flask用 **name** 这个参数确定程序的根目录，以便稍后能够找到相对于程序根目录的资源文件位置

## 2.2 路由和视图函数

  1. 路由 URL请求到Python函数的映射关系

  2. 修饰器 
        1. 以修饰函数为输入的函数，可修改函数的行为

            2. 通常使用修饰器把函数注册为事件的处理程序

                3. 例子 
       
                def simple_decorator(f):
             def wrapper():
              print("Entering Function")
              f()
              print("Exited Function")
             return wrapper
       
        @simple_decorator
        def hello():
          print("Hello World")
       
        hello()
       

        4. 输出 
            
                Entering Function
        Hello World
        Exited Function
       
  3. 修饰器声明路由案例 
        
        @app.route('/')

    def index():
       return "Hello"


其中：

  * `@`表示Python中的修饰器，

  * `app`表示Flask类的程序实例

  * `route`表示Flask类中的一个方法

  * `'/'`表示输入参数

  * `index()`是修饰器函数的输入

  4. 手写一个静态`@app.route()`
        
        class NotFlask():
       def __init__(self):
           self.routes = {}
        
       def route(self, route_str):
           def decorator(f):
               self.routes[route_str] = f
               return f
           return decorator
        
       def serve(self, path):
           view_function = self.routes.get(path)
           if view_function:
               return view_function()
           else:
               raise ValueError('Route "{}"" has not been registered'.format(path))

    app = NotFlask()
    
    @app.route("/")
    def hello():
       return "Hello World!"
    print(app.serve("/"))


输出：`Hello World!` 参考：https://blog.csdn.net/fang_chuan/article/details/81874678

  5. 视图函数 
        1. 类似于`index()`这种

            2. 视图函数的返回值称为 **响应**

                3. 可使用URL的动态部分作为视图函数的参数

                    4.         @app.route('/usr/')
                    def usr(name):
                      return "Hello %s" % name
       

        5. 动态部分默认是字符串类型，也可以是int，float和path类型，path类型也是字符串，但不把斜线视作分隔符

## 2.3 启动服务器

  1.     if __name__ == '__main__':
       app.run(debug=True)


  2. `__name__=='__main__'`确保直接执行这个脚本才启动开发Web服务器

## 2.4 一个完整的程序


​    
    from flask import Flask
    app = Flask(__name__)


​    
    @app.route('/')
    def index():
        return "Hello"


​    
    @app.route('/usr/')
    def usr(name):
        return "Hello %s" % name


​    
    if __name__ == '__main__':
        app.run(debug=True)


输出： ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210311102124.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210311102204.png)

## 2.5 请求-响应循环

**概念待补充...**

  1. 请求上下文
  2. 请求调度
  3. 请求钩子
  4. 响应

## 2.6 Flask扩展

Flask是轻量级框架，设计为可扩展形式，例如数据库和用户认证等，开发者可以自由选择最合适的包，或者按照需求自行开发。 **使用Flask-
Script支持命令行选项**

  1. 效果：使用命令行参数传递设置选项 
  2. 安装：`conda install flask-script`
  3. 使用： 
        
        from flask import Flask

    from flask_script import Manager
    
    app = Flask(__name__)
    manager = Manager(app)


​    
    @app.route('/')
    def index():
       return "Hello"


​    
    @app.route('/usr/')
    def usr(name):
       return "Hello %s" % name


​    
    if __name__ == '__main__':
       manager.run()


  4. 参数 
        1.         usage: hello.py [-?] {shell,runserver} ...
       
        positional arguments:
        {shell,runserver}
          shell            Runs a Python shell inside Flask application context.
          runserver        Runs the Flask development server i.e. app.run()
       
        optional arguments:
        -?, --help         show this help message and exit
       

        2. `shell`参数用于启动Python的Shell回话，`runserver`参数用于启动Web服务器 
        3. `runserver`参数后还有很多可选参数 
      1. `python hello.py runserver`：以调试模式启动Web服务器
      2. `python hello.py runserver --host 0.0.0.0`：让服务器监听公共网络接口上的连接，允许同网中的其他计算机连接服务器
      3. `python hello.py runserver --host 0.0.0.0 --threaded &`：开启多线程操作
        
                (MicroBlog) C:\Users\admin\PycharmProjects\MicroBlog>python hello.py runserver --help
        
          usage: hello.py runserver [-?] [-h HOST] [-p PORT] [--threaded] [--processes PROCESSES] [--passthrough-errors] [-d] [-D] [-r] [-R] [--ssl-crt SSL_CRT] [--ssl-key SSL_KEY]
      
        Runs the Flask development server i.e. app.run()
      
        optional arguments:
        -?, --help            show this help message and exit
        -h HOST, --host HOST
        -p PORT, --port PORT
        --threaded
        --processes PROCESSES
        --passthrough-errors
        -d, --debug           enable the Werkzeug debugger (DO NOT use in production code)
        -D, --no-debug        disable the Werkzeug debugger
        -r, --reload          monitor Python files for changes (not 100% safe for production use)
        -R, --no-reload       do not monitor Python files for changes
        --ssl-crt SSL_CRT     Path to ssl certificate
        --ssl-key SSL_KEY     Path to ssl key
      
        
      
  5. 设置Pycharm带参运行 
        1. ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210311110739.png)
            2. ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210311110802.png)

## 2.7 待补充

  * 请求-响应循环
  * 手写动态参数的修饰器

