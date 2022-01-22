---
title: Python学习之pyinstaller打包python程序的常见问题
date: 2019-08-22
permalink: /python-learning-pyinstaller-problem.html
tags:
 - Python
 - pyinstaller
 - 打包 
categories:
 - Python

---





    1. **shapely** 库相关 问题：

```shell
Unable to find "e:\github\forexe\venv\lib\site-packages\shapely\DLLs\geos.dll" when adding binary and data files.
```



解决： 在shapely库文件目录下，找到geos_c.dll文件，将其复制一份重命名为geos.dll
目录：`E:\GitHub\ForExe\venv\Lib\site-packages\shapely\DLLs`

![《pyinstaller打包python程序的常见问题》](https://i2.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/Screenshot_1.jpg?zoom=2&ssl=1)
![《pyinstaller打包python程序的常见问题》](https://i2.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/Screenshot_2.jpg?zoom=2&ssl=1)

    2. **pyproj** 库相关 问题： 

```shell
ModuleNotFoundError: No module named 'pyproj._datadir'
```

解决： pyproj库的安装有问题，到[官网](https://www.lfd.uci.edu/~gohlke/pythonlibs/)
https://www.lfd.uci.edu/~gohlke/pythonlibs/下载对应的包重新安装即可。
例如我用的window系统64位python3.6,则下载pyproj‑2.1.3‑cp36‑cp36m‑win_amd64.whl到项目文件夹，使用命令
`pip install pyproj‑2.1.3‑cp36‑cp36m‑win_amd64.whl` 即可正确安装pyproj库
![《pyinstaller打包python程序的常见问题》](https://i0.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/1566438904431.png?zoom=2&ssl=1)
更新：
如果重新安装库后，仍出现上述问题，提示缺少pyproj._datadir或pyproj.datadir，则将缺少的模块加入到hiddenimports中，如下：
` hiddenimports=['pyproj._datadir','pyproj.datadir'` 重新编译spec文件，即可解决

    3. **numpy** 相关 问题： 

```shell
ModuleNotFoundError: No module named 'numpy.random.common'
```




两个解决方法 方法一：（推荐） 在打包生成的spec文件中，在hiddenimports参数中添加如下内容：


        hiddenimports=['numpy.random.common','numpy.random.bounded_integers','numpy.random.entropy']

![《pyinstaller打包python程序的常见问题》](https://i1.wp.com/raw.githubusercontent.com/guangmujun/mybooks/master/tech_book/imgs/Screenshot_3.jpg?zoom=2&ssl=1)
方法二： 在使用到numpy库的py文件中，加入下述内容


        import numpy.random.common
    import numpy.random.bounded_integers
    import numpy.random.entropy


    4. **sklearn** 相关 问题： 

```shell
ModuleNotFoundError: No module named 'sklearn.utils._cython_blas'
```




解决: 在打包生成的spec文件中，在hiddenimports参数中添加如下内容：


        hiddenimports=['sklearn.utils._cython_blas','cython', 'sklearn', 'sklearn.ensemble','sklearn.neighbors.typedefs','sklearn.neighbors.quad_tree','sklearn.tree._utils','scipy._lib.messagestream']


    5. **geopandas** 库相关 问题： 

    File "site-packages\geopandas\datasets\__init__.py", line 7, in 
    StopIteration
    [6764] Failed to execute script application


解决: 找到geopandas库文件下的`__init__.py`,将`import geopandas.datasets`这句注释掉



