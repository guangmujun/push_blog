---
title: QGIS教程：基础教程一
date: 2020-07-16
permalink: /qgis-tutorial-base-one.html
tags:
 - GIS
 - QGIS
 - 教程
categories:
 - GIS
---

# 1 加载OpenStreetMap底图

双击如图所示的按钮即可

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200716085652.png" alt="img" style="zoom:50%;" />

# 2 裁剪指定区域数据

如：从江苏路网数据中裁剪出扬州市的路网数据

1. 点击“相交”操作

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200716090202.png" alt="img" style="zoom:50%;" />

1. 输出层：江苏路网数据；相交层：扬州市的features；注意这里是将整个江苏的行政区划中选择了扬州市的部分，故需要在“selected features only”前打勾；最后选择输出的位置和文件格式以及文件名；最后点击“run”。

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200716090419.png" alt="img" style="zoom:50%;" />

1. 运行一会后，裁剪成功。

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200716102056.png" alt="img" style="zoom:50%;" />

# 3 BD019、GCJ02、WGS相互转换

1. 点击“Plugins”菜单栏中第一项，在弹出的窗口中搜索“GeoHey”插件，并安装

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200716102302.png" alt="img" style="zoom:50%;" />

1. 安装完成后，点击“Toolbox”，可以看到GeoHey已经可用

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717091524.png" alt="img" style="zoom:50%;" />

1. 双击“GCJ02 to WGS”，在弹出的窗口中选择好输入图层，以及确定好保存的位置和格式等

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200716102534.png" alt="img" style="zoom:50%;" />

1. 点击“run”，运行完成后，将生成的4个文件全部拖入到QGIS中，效果如下，路网与底图匹配。

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200716103959.png" alt="img" style="zoom:50%;" />

# 4 按条件筛选多个特征

1. 点击漏斗按钮，输入查询属性对应的条件，选择查询方式，然后点击选择特征

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717085820.png" alt="img" style="zoom:50%;" />

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717090609.png" alt="img" style="zoom:50%;" />

1. 再次点击漏斗按钮，输入第二个查询条件，此时选择“add to current selection”，这样的话最后选中的就是这两次查询结果的所有特征

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200717090627.png" alt="img" style="zoom:50%;" />

