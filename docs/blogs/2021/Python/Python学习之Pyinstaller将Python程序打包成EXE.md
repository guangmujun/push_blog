---
title: Python学习之Pyinstaller将Python程序打包成EXE
date: 2019-08-13
permalink: /python-learning-pyinstaller-python-to-exe.html
tags:
 - Python
 - Pyinstaller
 - 打包 
categories:
 - Python

---

## 安装


​    
    pip install pyinstaller


## 整体流程


​    
    pyi-makespec xxx.py     # 先生成spec文件
    pyinstaller xxx.spec    # 再生成exe文件


## 参数说明

`-F` ：打包成一个exe文件（在dist文件夹下）


​    
    pyi-makespec -F xxx.py
    pyinstaller xxx.spec


`-D` ：生成一个包含exe的文件夹


​    
    pyi-makespec -D xxx.py
    pyinstaller xxx.spec


## 单一PY文件

按上述操作即可

## 包含数据文件

用文本编辑器打开spec文件，修改文件中的参数 `datas=[]` 例如要打包 `global_popu.tif` 到exe中时

  1. pec文件中的参数修改为`datas=[('global_popu.tif', '.')]`

  2. 然后将spec文件编译成exe，两点注意： 
        1. 将数据文件和xxx.py文件放在同一目录
            2. 对xxx.py程序读取数据的部分需要修改，修改方法如下


​    
    a = Analysis(['trip_popu.py'],
                 pathex=['E:\\GitHub\\Zone\\Zone'],
                 binaries=[],
                 datas=[('global_popu.tif', '.')],
                 hiddenimports=[],
                 hookspath=[],
                 runtime_hooks=[],
                 excludes=[],
                 win_no_prefer_redirects=False,
                 win_private_assemblies=False,
                 cipher=block_cipher,
                 noarchive=False)


​    
​    
    # 对xxx.py的修改
    # 添加自定义的函数
    def resource_path(relative_path):    
        base_path = getattr(        
            sys, '_MEIPASS', os.path.dirname(            
                os.path.abspath(__file__)))    
        return os.path.join(base_path, relative_path)
    
    #global_popu_Dic = resource_path("global_popu.tif")  # 打包时使用
    global_popu_Dic = "../data/global_popu.tif"         # 调试时使用


如果要打包两个或者多个数据文件，则对spec中的`datas` 修改参考下例： `datas=[('china_light_2016.tif',
'.'),('china_population_2016.tif', '.')]`

## 多个PY文件

整体操作与上述类似，关键在于修改spec中的参数 例如：code文件夹下的trip_popu.py用到了zone_func文件夹目录下的func.py文件，
在spec文件中的`Analysis`的第一个参数中加上func.py文件的绝对路径，然后生成exe即可


​    
    a = Analysis(['trip_popu.py','E:\\GitHub\\Zone\\Zone\\zone_func\\func.py'],
                 pathex=['E:\\GitHub\\Zone\\Zone'],
                 binaries=[],
                 datas=[('global_popu.tif', '.')],
                 hiddenimports=[],
                 hookspath=[],
                 runtime_hooks=[],
                 excludes=[],
                 win_no_prefer_redirects=False,
                 win_private_assemblies=False,
                 cipher=block_cipher,
                 noarchive=False)


## 多进程打包

编写的程序中包含多进程处理时，正常打包运行exe后，电脑会卡死 所以在打包前，需先要对xxx.py文件进行修改，修改内容为：


​    
    import multiprocessing
    
    if __name__ == "__main__":
        multiprocessing.freeze_support()    # 这一句一定要放在if __name__ == "__main__":下面


修改后，正常打包即可

## 问题记录

  1. 程序有使用到shapely库,打包时会提示 **缺少geos.dll** 将提示的shapely库的路径下的geos_c.dll复制一份重命名为geos.dll,重新打包即可 
  2. 程序有使用到geopandas库,打包时运行后提示 
      

    File "site-packages\geopandas\datasets\__init__.py", line 7, in 
    StopIteration
    [6764] Failed to execute script application


找到geopandas库文件下的`__init__.py`,将`import geopandas.datasets`这句注释掉

  3. 程序有使用到sklearn库时,打包运行时提示缺少一些模块,如`sklearn.utils._cython_blas` 修改spec文件中的`hiddenimports`参数后,重新打包,修改如下 
        
        
        ```shell
        a = Analysis(['mainarea_buffer.py','E:\\GitHub\\Zone\\Zone\\zone_func\\func.py'],
                pathex=['E:\\GitHub\\Zone\\Zone'],
                binaries=[],
                datas=[('global_popu.tif', '.')],
                hiddenimports=['sklearn.utils._cython_blas','cython', 'sklearn', 'sklearn.ensemble','sklearn.neighbors.typedefs','sklearn.neighbors.quad_tree','sklearn.tree._utils','scipy._lib.messagestream'],
                hookspath=[],
                runtime_hooks=[],
                excludes=[],
                win_no_prefer_redirects=False,
                win_private_assemblies=False,
                cipher=block_cipher,
                noarchive=False)
        ```
        
        


## 参考

Github：<https://github.com/guangmujun> CSDN :
<https://me.csdn.net/qq_37054356>

