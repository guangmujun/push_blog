---
title: DCIC2021算法分析题学习分享二：任务一Baseline详解
date: 2021-02-25
permalink: /data-mining-dcic-2021-two.html
tags:
 - 数据挖掘
 - DCIC 
categories:
 - 数据挖掘
---







## 提交结果

![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210224220213.png)
完整顺了一遍baseline，用KNN进行经纬度距离计算，分数有提高一点～

## 赛题任务解析

### 赛题任务

  * `赛题任务`：识别出工作日早高峰07:00-09:00潮汐现象最突出的40个区域，针对Top40区域计算结果进一步设计高峰期共享单车潮汐点优化方案；
  * `赛题数据`：共享单车轨迹数据、共享单车停车点位（电子围栏）数据 和 共享单车订单数据；

### 数据说明

  * gxdc_gj20201221.csv：共享单车轨迹数据 
    * BICYCLE_ID：车辆编码
    * LOCATING_TIME：定位时间
    * LATITUDE：纬度（WGS84坐标）
    * LONGITUDE：经度（WGS84坐标）
  * gxdc_tcd.csv：共享单车停车点位（电子围栏）数据 
    * FENCE_ID：电子围栏唯一编号
    * FENCE_LOC：电子围栏位置坐标串（包括电子围栏所在位置四个顶点的坐标信息，WGS84坐标）
  * gxdc_dd.csv：共享单车订单数据 
    * BICYCLE_ID：车辆编码
    * LATITUDE：纬度（WGS84坐标）
    * LONGITUDE：经度（WGS84坐标）
    * LOCK_STATUS：锁的状态（0-开锁，1-关锁）
    * UPDATE_TIME：锁状态更新时间

### 数据探索

#### 轨迹数据

  1. 读取数据 拼接不同天的单车轨迹数据，默认axis=0，按行拼接 
        
        bike_track = pd.concat([
       pd.read_csv(PATH + 'gxdc_gj20201221.csv'),
       pd.read_csv(PATH + 'gxdc_gj20201222.csv'),
       pd.read_csv(PATH + 'gxdc_gj20201223.csv'),
       pd.read_csv(PATH + 'gxdc_gj20201224.csv'),
       pd.read_csv(PATH + 'gxdc_gj20201225.csv')

    ])


  2. 路线可视化 folium用于地图的可视化 
        
        
        # 初始化中心位置和缩放尺度

    m = folium.Map(location=[24.482426, 118.157606], zoom_start=12)
    # 初始化单车的轨迹
    my_PolyLine = folium.PolyLine(locations=bike_track[bike_track['BICYCLE_ID'] == '000152773681a23a7f2d9af8e8902703']
                                 [['LATITUDE', 'LONGITUDE']].values, weight=5)
    # 将轨迹添加至底图
    m.add_child(my_PolyLine)
    # 保存地图到html
    m.save('../output/track_example.html')


示例：可视化一辆单车一天的轨迹 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210224221345.png)

#### 电子围栏数据

  1. 读取数据 
        
        def bike_fence_format(s):
       s = s.replace('[', '').replace(']', '').split(',')
       s = np.array(s).astype(float).reshape(5, -1)
       return s

    bike_fence = pd.read_csv(PATH + 'gxdc_tcd.csv')
    bike_fence['FENCE_LOC'] = bike_fence['FENCE_LOC'].apply(bike_fence_format)


  2. 围栏可视化 
        
        fence_map = folium.Map(location=[24.482426, 118.157606], zoom_start=12)

    # 逐个点标记，逐个点添🏠至底图
    for data in bike_fence['FENCE_LOC'].values[:100]:
       folium.Marker(list(data[0, ::-1])).add_to(fence_map)
    fence_map.save('../output/fence_example.html')


示例：在地图上标记前100个电子围栏的点 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210224222116.png)

#### 订单数据

  1. 读数据 
        
        bike_order = pd.read_csv(PATH + 'gxdc_dd.csv')

    bike_order = bike_order.sort_values(['BICYCLE_ID', 'UPDATE_TIME'])


  2. 单车位置可视化 
        
        order_map = folium.Map(location=[24.482426, 118.157606], zoom_start=12)

    # 一辆单车各个时刻的轨迹点，连接成线
    order_PolyLine = folium.PolyLine(locations=bike_order[bike_order['BICYCLE_ID'] == '0000ff105fd5f9099b866bccd157dc50']
                                    [['LATITUDE', 'LONGITUDE']].values, weight=5)
    order_map.add_child(order_PolyLine)
    order_map.save('../output/order_example.html')


示例：一辆单车多天的轨迹 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210224222640.png)

## 共享单车潮汐点分析

### 分析目标

  * 共享单车订单与停车点匹配
  * 统计并可视化停车点潮汐情况
  * 计算工作日早高峰07:00-09:00潮汐现象最突出的40个区域

### 数据处理

#### 电子围栏数据处理


​    
    # 得出停车点 LATITUDE 范围
    bike_fence['MIN_LATITUDE'] = bike_fence['FENCE_LOC'].apply(lambda x: np.min(x[:, 1]))
    bike_fence['MAX_LATITUDE'] = bike_fence['FENCE_LOC'].apply(lambda x: np.max(x[:, 1]))
    
    # 得到停车点 LONGITUDE 范围
    bike_fence['MIN_LONGITUDE'] = bike_fence['FENCE_LOC'].apply(lambda x: np.min(x[:, 0]))
    bike_fence['MAX_LONGITUDE'] = bike_fence['FENCE_LOC'].apply(lambda x: np.max(x[:, 0]))
    
    from geopy.distance import geodesic
    # 使用测地线距离衡量电子围栏的面积
    bike_fence['FENCE_AREA'] = bike_fence.apply(lambda x: geodesic(
        (x['MIN_LATITUDE'], x['MIN_LONGITUDE']), (x['MAX_LATITUDE'], x['MAX_LONGITUDE'])
    ).meters, axis=1)
    
    # 计算电子围栏的中心经纬度
    bike_fence['FENCE_CENTER'] = bike_fence['FENCE_LOC'].apply(
        lambda x: np.mean(x[:-1, ::-1], 0)
    )


### 订单数据处理


​    
    # 订单数据的时间特征提取
    bike_order['UPDATE_TIME'] = pd.to_datetime(bike_order['UPDATE_TIME'])
    bike_order['DAY'] = bike_order['UPDATE_TIME'].dt.day.astype(object)
    bike_order['DAY'] = bike_order['DAY'].apply(str)
    
    bike_order['HOUR'] = bike_order['UPDATE_TIME'].dt.hour.astype(object)
    bike_order['HOUR'] = bike_order['HOUR'].apply(str)
    bike_order['HOUR'] = bike_order['HOUR'].str.pad(width=2,side='left',fillchar='0')
    
    # 日期和时间进行拼接
    bike_order['DAY_HOUR'] = bike_order['DAY'] + bike_order['HOUR']


#### Geohash编码经纬度

  1. geohash基本原理： 是将地球理解为一个二维平面，将平面递归分解成更小的子块，每个子块在一定经纬度范围内拥有相同的编码

  2. geohash特性： 
        1. 不同的编码长度，表示不同的范围区间，字符串越长，表示的范围越精确
            2. 字符串相似的表示距离相近
            ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210224224828.png)

  3. 对订单数据和电子围栏数据的经纬度信息，进行geohash编码 
        
        import geohash

    bike_order['geohash'] = bike_order.apply(
       lambda x: geohash.encode(x['LATITUDE'], x['LONGITUDE'], precision=6), 
    axis=1)
    
    bike_fence['geohash'] = bike_fence['FENCE_CENTER'].apply(
       lambda x: geohash.encode(x[0], x[1], precision=6)
    )


  4. geohash学习： 
        1. [geohash介绍](https://www.cnblogs.com/feiquan/p/11380461.html)
            2. [DCIC2020](https://coggle.club/learn/dcic2020/task5)

#### 电子围栏内流量统计

使用透视表统计每个区域在不同时间的入流量和出流量：


​    
    # LOCK_STATUS=1,表示关锁，将单车停入电子围栏，为入流量
    bike_inflow = pd.pivot_table(bike_order[bike_order['LOCK_STATUS'] == 1], 
                       values='LOCK_STATUS', index=['geohash'],
                        columns=['DAY_HOUR'], aggfunc='count', fill_value=0
    )
    
    bike_outflow = pd.pivot_table(bike_order[bike_order['LOCK_STATUS'] == 0], 
                       values='LOCK_STATUS', index=['geohash'],
                        columns=['DAY_HOUR'], aggfunc='count', fill_value=0
    )


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210224230400.png)

#### 电子围栏潮汐情况可视化


​    
    bike_inflow.loc['wsk593'].plot()
    bike_outflow.loc['wsk593'].plot()
    plt.xticks(list(range(bike_inflow.shape[1])), bike_inflow.columns, rotation=40)
    plt.legend(['入流量', '出流量'])


下图表示：wsk593编码对应的区域多天的单车停入量和驶出量 ![](https://my-imags.oss-cn-
shanghai.aliyuncs.com/pic/20210224225533.png)

### 匹配计算潮汐

#### Geohash匹配

  1. 计算每个区域的留存流量 
        
        bike_remain = (bike_inflow - bike_outflow).fillna(0)

    # 存在骑走的车数量 大于 进来的车数量
    bike_remain[bike_remain < 0] = 0  
    
    # 按照天求和：某个区域的多天的留存量之和
    bike_remain = bike_remain.sum(1)


  2. 统计街道维度的潮汐情况 
        1. 提取街道信息 ![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210224230910.png)
       
                bike_fence['STREET'] = bike_fence['FENCE_ID'].apply(lambda x: x.split('_')[0])
       

        2. 计算街道的留存车辆密度 
      1. 先按照街道名称分组
      2. 再提取出geohash列
      3. 再对geohash列去重（不重复计算相同区域的留存量）
      4. 再计算每一个编码区域的留存车辆
      5. 然后计算每个街道所有区域的面积和
      6. 最后求出街道维度的留存车辆密度
        
                # 留存车辆 / 街道停车位总面积，计算得到密度
          bike_density = bike_fence.groupby(['STREET'])['geohash'].unique().apply(
          lambda hs: np.sum([bike_remain[x] for x in hs])
          ) / bike_fence.groupby(['STREET'])['FENCE_AREA'].sum()
      
        # 按照密度倒序
        bike_density = bike_density.sort_values(ascending=False).reset_index()
      

#### 距离匹配

  1. 使用电子围栏的中心点经纬度数据拟合knn haversine：经纬度计算距离 
        
        from sklearn.neighbors import NearestNeighbors

    # https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.DistanceMetric.html
    knn = NearestNeighbors(metric = "haversine", n_jobs=-1, algorithm='brute')
    knn.fit(np.stack(bike_fence['FENCE_CENTER'].values))


  2. 找到每个订单最近的一个电子围栏，（距离，电子围栏的index） 全量数据耗时约5分钟 
        
        dist, index = knn.kneighbors(bike_order[['LATITUDE','LONGITUDE']].values[:], n_neighbors=1)


  3. 计算所有停车点的潮汐流量 
        
        
        # 订单最近的电子围栏的ID

    bike_order['fence'] = bike_fence.iloc[index.flatten()]['FENCE_ID'].values
    
    # 数据的每一行为一个FENCE_ID，每一列为某天的流量
    bike_inflow = pd.pivot_table(bike_order[bike_order['LOCK_STATUS'] == 1], 
                      values='LOCK_STATUS', index=['fence'],
                       columns=['DAY'], aggfunc='count', fill_value=0
    )
    
    bike_outflow = pd.pivot_table(bike_order[bike_order['LOCK_STATUS'] == 0], 
                      values='LOCK_STATUS', index=['fence'],
                       columns=['DAY'], aggfunc='count', fill_value=0
    )
    
    bike_remain = (bike_inflow - bike_outflow).fillna(0)
    bike_remain[bike_remain < 0] = 0  
    bike_remain = bike_remain.sum(1)


  4. 计算停车点的密度 set_index：使用FENCE_ID作为索引 
        
        bike_density = bike_remain / bike_fence.set_index('FENCE_ID')['FENCE_AREA']

    bike_density = bike_density.sort_values(ascending=False).reset_index()
    bike_density = bike_density.fillna(0)


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210224235644.png)

### 结果输出


​    
    # label临时使用，后面被FENCE_TYPE替换
    bike_density['label'] = '0'
    # 前100行的FENCE_TYPE设置为1
    bike_density.iloc[:100, -1] = '1'
    bike_density['BELONG_AREA'] = '厦门'
    # 删除停车点的密度属性
    bike_density = bike_density.drop(0, axis=1)
    bike_density.columns = ['FENCE_ID', 'FENCE_TYPE', 'BELONG_AREA']
    bike_density.to_csv('../result/result.txt', index=None, sep='|')


![](https://my-imags.oss-cn-shanghai.aliyuncs.com/pic/20210224235401.png)

## 优化方向

  1. 区域留存流量的计算，为什么会有单车驶出数量大于驶入数量多情况？为什么是求多天留存量之和，不是平均？
  2. 使用电子围栏的中心点经纬度拟合knn

