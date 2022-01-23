---
title: OSM2GMNS使用教程【导出OSM路网】
date: 2020-12-29
permalink: /openstreetmap-osm2gmns-export-roadnet.html
tags:
 - OpenStreetMap
 - OSM2GMNS
 - 路网
categories:
 - OpenStreetMap
---






## 效果

简单操作即可从OpenStreetMap中提取目标路网并输出为符合GMNS标准的路网文件。

  * 支持解析出多种类型的网络，包括：auto, bike, walk, railway, aeroway
  * 支持下载POI数据，并可将POI自动连接至交通小区和网络

## 安装


​    
    pip install osm2gmns


## 使用

[OSM官网](www.openstreetmap.org)框选一块地图进行下载


​    
    import osm2gmns as og


​    
    def main():
        net = og.getNetFromOSMFile('../data/map1.osm',
                                   strict_mode=False,               
                                   # 设置是否删除框选区域范围外的数据，默认为True
                                   min_nodes=1,                     
                                   # 设置删除子网络的条件节点数，默认为1
                                   combine=True,                    
                                   # 设置短路是否合并，设置为True的话会生成segment.csv，默认为False
                                   default_lanes=True,              
                                   # 设置默认车道数，默认为False
                                   default_speed=True,              
                                   # 设置默认车速，默认为False
                                   network_type=('walk',),          
                                   # 设置不同类型的路网，auto, bike, walk, railway, aeroway.
                                   POIs=True,                       
                                   # 设置是否生成POI点，True的话会生成poi.csv
                                   )
        # og.consolidateComplexIntersections(net)                   
        # 是否简化交叉口
        # og.connectPOIWithNet(net)                                 
        # 是将POI和路网中的最近点连接起来
        og.outputNetToCSV(net, output_folder='../result/walk/')     
        # 输出结果到csv


​    
    if __name__ == '__main__':
        main()


​    

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201229160156.png)

## 可视化

  1. 打开QGIS软件，如下图，选择【Add Delimited Text Layer】

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201229160509.png)

  2. 选择生成的csv文件，这里我们先选择节点的文件node.csv，几处需要注意的地方，点击Add

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201229162622.png)
![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201229162701.png)

  3. 同理添加其他csv文件

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20201229162846.png)

## 补充

[GMNS](https://zephyrtransport.org/projects/2-network-standard-and-tools/)
General Modeling Network Specification

> 详细请参考 微信推文：https://mp.weixin.qq.com/s/ush4Ff_g__3HDSJJBn2VQQ
> 用户手册：https://osm2gmns.readthedocs.io/en/latest/

