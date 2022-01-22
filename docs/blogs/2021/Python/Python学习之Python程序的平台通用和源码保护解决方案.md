---
title: Python学习之Python程序的平台通用和源码保护解决方案
date: 2019-10-16
permalink: /python-learning-protect-code.html
tags:
 - Python
 - Pyd
 - 保护 
categories:
 - Python
---



## 前言

之前在做项目时，是怎么调用Python写的代码？怎么保护源码呢？ 保护源码：用pyinstaller库将所有程序包括数据打包成一个EXE文件。
调用Python程序：调用打包好的EXE文件。 遇到的问题：

  1. pyinstaller打包过程慢，出现的问题多。
  2. EXE文件很大，打包了Python解释器和用到的一些第三方库。
  3. EXE文件很容易被反编译，导致源码暴露出来。

不得不说，好巧！无意间点开一篇推文，找到了较好的解决方法，在此复述和补充。

> https://mp.weixin.qq.com/s/GqDl2_ntD74ISsrHxsAPAg

## 平台通用

Python 代码要想执行，机器上必须有一个 Python 解释器，也就是从官网下载的 Python 安装程序。但想运行你写的程序的人，自己电脑上不一定有Python 解释器，可能也不会安装，不会设置环境变量，不会打开命令窗口。 

最好的方法是像 C 或 C++ 那样，直接编译成 exe 文件，别人一运行这个exe 文件就可以运行。Python 提供了类似的工具，pyinstaller 和 py2exe 都可以将 Python 源文件（.py）打包成 exe文件。但这个 exe 文件并不是走真正编译生成的，是把 Python 解释器和 Python 源文件打包在一起，因此生成的 exe 文件都很大。

上述方法不能保证每台机器都能正常运行，因为它依赖很多 Windows dll 文件，而且在打包过程中很容易报错，也是缺少各种各样的头文件。后来发现Python 官网中提供了这样的一种版本：Windows x86-64 embeddable zip file。看了官网的介绍，这是一个绿色名安装的
Python 解释器，可以嵌入其他程序中以便执行 Python 程序，具体步骤如下：

  1. 官网下载选择`embeddable zip`类型的python压缩包（体积很小，python3.6.0的只有6.6MB）

![《Python程序的平台通用和源码保护解决方案》](https://i2.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1571124337745.png?zoom=2&ssl=1)

  2. 写好 Python 代码后，将 Python 源代码和 python-x.x.x-embed-amd64 文件夹放在一起，再提供一个 startup.bat 文件，写入以下内容： 
     

    python-3.6.0-embed-amd64\python.exe test.py
    pause

文件夹目录和代码图：
![《Python程序的平台通用和源码保护解决方案》](https://i1.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1571148487995.png?zoom=2&ssl=1)

  3. 双击 startup.bat 即可运行你提供的 Python 程序。如果代码中使用第三方的库。则需要修改 python-3.7.4-embed-amd64 目录下的 python37._pth 文件，把最后一行的注释去掉，文件内容应该是这样的：![《Python程序的平台通用和源码保护解决方案》](https://i1.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1571148687563.png?zoom=2&ssl=1)

    4. 然后将同版本 Python pip 安装后的包从 site-packages 复制到 python-x.x.x-embed-amd64\Lib\site-packages 即可,需要自己新建名为Lib和site-packages的文件夹。 ![《Python程序的平台通用和源码保护解决方案》](https://i0.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1571148943917.png?zoom=2&ssl=1)
    5. 这样下来，你写的所有 Python 程序都可以放在这里，免去别人安装各种软件和依赖的麻烦，别人解压你的提供的压缩包，双击 startup.bat 即可运行，不需要任何额外的配置，简单易行。
  6. 可考虑在项目中直接调用Python解释器运行启动文件如（test.py），或考虑打包出小的exe。

## 源码保护

Python 是一种解释型语言，解释型的语言特点就是常容易被反编译，如果代码中涉及加密环节，一但被破解就不好玩了。虽然 Python 也支持编译成Python 字节码，如 pyc、pyo 文件，但可以轻松反编译，如 uncompyle6 就可以轻松反编译，代码规范的话，甚至连注释都给你还原出来。

上述的 py2exe，pyinstaller虽然也起一定的保护作用，但其本质是打包，不是编译，因此也可以破解，感兴趣的可以去网上搜索下。最彻底的方式是使用编译型的语言来写代码，像 C、C++那样，编译后直接生成机器代码，全是二进制的 0 或 1，无论如何也是没有办法反编译出来的。 借助这个思路就有 **两种方案** ：

1、并不是所有的代码都需要保密：需要保密的那部分代码可以使用 C 来写，然后生成使用 gcc 等编译器生成 Windows 的动态链接库文件 dll文件，然后使用 Python 来引入 dll 文件。 

    import ctypes
    dll = ctypes.windll.LoadLibrary( 'test.dll' )

这样，我们就可以使用 dll.function() 来调用 dll 文件中的函数了。 2、生成 pyd 文件，pyd 文件本质是 dll 文件，是适用于Python 的 dll 文件，因此叫 pyd，可以可直接被 python 通过 import 导入。以下代码可以将 python 源代码直接编译成 pyd
文件。

  * 注意先安装 Cython

    ```shell
    pip install Cython
    ```

    

  * 新建setup.py 文件，内容如下，可根据需要进行修改。

    ```shell
    from distutils.core import setup
    from Cython.Build import cythonize
    
    build_dir = 'build'
    build_tmp_dir = 'build/temp'
    
    setup(
        name = 'myapp',
        ext_modules=cythonize(['aaa.py','bbb.py','ccc.py']),
        #script_args=["build_ext", "-b", build_dir, "-t", build_tmp_dir],
        script_args=["install",]
    )
    ```

以第2种方法 **举个栗子** ：

  * 文件夹目录下文件如图，新建函数文件`my_test.py`、编译文件`setup.py`、启动文件`app.py`![《Python程序的平台通用和源码保护解决方案》](https://i2.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1571152549814.png?zoom=2&ssl=1)

​		![《Python程序的平台通用和源码保护解决方案》](https://i1.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1571152580055.png?zoom=2&ssl=1)

  * 在目录内执行 python setup.py 即可将 my_test.py 编译成对应的 pyd ，并安装在 Python 的库目录 site-packages 中，并将pyd文件复制到前述所在的文件夹目录中，如图。 

![《Python程序的平台通用和源码保护解决方案》](https://i0.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1571152762411.png?zoom=2&ssl=1)

![《Python程序的平台通用和源码保护解决方案》](https://i0.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1571153073656.png?zoom=2&ssl=1)

  * 将pyd文件之外的新生成文件删除，以及删除my_test.py，运行启动文件app.py，程序中从我们写的my_test库中引入自定义的函数my_print。

![《Python程序的平台通用和源码保护解决方案》](https://i1.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1571153153456.png?zoom=2&ssl=1)

  * 运行成功，我们自定义的函数被编译成pyd文件保护起来。 

![《Python程序的平台通用和源码保护解决方案》](https://i1.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1571153277115.png?zoom=2&ssl=1)

## 遇到问题

大部分情况下，你在编译成 pyd 时都会报错，提示缺少 vcvarsall.bat，像这样：

    error: Unable to find vcvarsall.bat

**推文作者的建议：** 解决方法：https://devblogs.microsoft.com/python/unable-to-find-vcvarsall-bat/#comments 

对于 Python3 来说，安装下 vs2019 就可以了，选择 C/C++ 组件，及 Windows 10sdk。约占用 4G 左右空间。 在 Linux 系统下，对应的是 so 文件，道理是相通的，掌握一个系统，很容易搞定其他系统。 **自己的摸索：**
虽然参考了作者的建议，安装了对应的vs2019，但运行后仍是出现上述错误， 不知道问题出在哪里，便自行摸索了一波。

  1. 修改`setup.py`内容，加入这句`import setuptools`，如下： 
       

    import setuptools  # 新增
    from distutils.core import setup
    from Cython.Build import cythonize
    
    build_dir = 'build'
    build_tmp_dir = 'build/temp'
    
    setup(
       name = 'myapp',
       ext_modules=cythonize(['my_test.py']),
       #script_args=["build_ext", "-b", build_dir, "-t", build_tmp_dir],
       script_args=["install",]
    )


  2. 重新运行`setup.py`，又出现如下提示： 
    
            ```shell
            Microsoft Visual C++ 14.0 is required
            ```


提示中还给出了Microsoft Visual C++ Build
Tools的链接，但是无法打开，便在网上重新找到了链接下载安装，http://www.xdowns.com/soft/38/138/2017/Soft_226169.html

  3. 如果还出现下述错误，可参考文中给出的解决方法。 问题1： 
        
        
        ```shell
        LINK : fatal error LNK1158: cannot run 'rc.exe' error: command 'C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\BIN\link.exe' failed with exit status 1158
        ```
        
        


解决方法：

    1. Add this to your `PATH` environment variables: `C:\Program Files (x86)\Windows Kits\10\bin\x64`
    2. Copy these files `rc.exe` & `rcdll.dll` from `C:\Program Files (x86)\Windows Kits\8.1\bin\x86`to `C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\bin`
问题2：


        command 'cl.exe' failed


解决方法：

    1. Install the C++ compiler <http://landinghub.visualstudio.com/visual-cpp-build-tools>
    2. Go to the installation folder (In my case it is): C:\Program Files (x86)\Microsoft Visual C++ Build Tools
    3. Open Visual C++ 2015 x86 x64 Cross Build Tools Command Prompt
    4. Type: `pip install package_name`



