---
title: QGIS教程：基础教程二
date: 2020-08-12
permalink: /qgis-tutorial-base-two.html
tags:
 - GIS
 - QGIS
 - 教程
categories:
 - GIS
---

## 使用多表达式，多条件筛选

比如一次筛选出多种类型的道路

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200812102045.png" alt="img" style="zoom:50%;" />

## WGS84转UTM

选择Reproject Layer工具，选择对应的图层，然后选择投影的目标坐标系，这里选择UTM zone 50N，根据所在位置选择对应的number和letter

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200812102244.png" alt="img" style="zoom:50%;" />

## 建立缓冲区

将地图的坐标投影成UTM后，选择buffer工具，则可以直接使用米或者千米等单位，下面有两个参数，我都选择了Roud，这两个主要是控制缓冲区的形状，可以自行尝试效果。另外，Dissolve result是控制是否将缓冲区合并

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200812102506.png" alt="img" style="zoom:50%;" />

## 按条件裁剪

点击Clip工具，比如从江苏省的路网中裁剪出宝应市的路网，input layer选江苏省路网，overlay layer选择宝应市的边界即可，Clipped中输入保存的位置。

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200812102753.png" alt="img" style="zoom:50%;" />

## 批处理

批处理简直是解放劳动力的神器，很好用。

以批量裁剪为例，右击Clip选择Execute as Batch Process，然后会跳出左边的窗口，点击加号，可以新增一行，比如要从江苏省的路网中裁剪出宝应和滨海的路网，则input layer中都选择江苏省路网，overlay layer分别选择宝应和滨海的边界，然后输入保存的位置，运行即可。

适合需要多次重复操作的情况，不仅是clip，很多工具都可以在批处理中使用。

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200812103052.png" alt="img" style="zoom:50%;" />

## 导入CSV，属性连接

直接将csv文件拖入QGIS中，即可实现导入。如何实现将csv中的字段值添加到shp文件中？

点击Join attributes by fileld value，input layer选择shp文件，Table field选择对应的相同的字段，input layer2选择csv文件，Table field 2选择需要导入到shp文件的属性，然后运行即可。

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200812103558.png" alt="img" style="zoom:50%;" />

## 字段类型转换

安装MMQGIS插件，里面有对应的字段数据类型转换工具

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200812103920.png" alt="img" style="zoom:50%;" />

## 通过创建空间索引加速

创建空间索引很简单，但是却非常有用，比如在统计多边形点的个数时，如果点图册没有空间索引，则统计的速度会非常慢。直接选择Create spatial index工具，然后选择需要建立空间索引的图层，运行即可，配合批操作食用更佳。

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200812104042.png" alt="img" style="zoom:50%;" />

## 统计多边形内点的个数

如果图层没有空间索引，建议先按照上一步骤建立空间索引，有奇效！

选择Count points in polygon工具，选项中选择对应的图层，需要两节下面两个字段函数的意义的话，可以点击help，跳转到官网，解释的很清楚。Count field name就是要加入到polygon图层的字段名称，里面的值就是每个polygon中的point的个数。

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200812104327.png" alt="img" style="zoom:50%;" />

## 修改字段名称

右击图层，选择属性，选择字段，点击铅笔按钮后，双击字段名称即可修改，修改完成后再次点击铅笔按钮进行保存。

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200812104628.png" alt="img" style="zoom:50%;" />

## 根据属性值进行可视化

先选择Graduated的这种渐变格式，然后在Value这一栏中选择需要可视化的属性值，这里需要注意的是：属性值的类型必须是整醒或者浮点型，不能是字符串，否则需要进行字段数据类型的转换，这一操作在前述也有讲过。

再选择喜欢的色条颜色，然后点击Classify后，出现图例及其对应的值，可以直接双击修改，最后运行即可。

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200812104818.png" alt="img" style="zoom:50%;" />

<img src="https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20200812105110.png" alt="img" style="zoom:50%;" />

