---
title: 离散选择模型（二）：基础应用（Discrete Choice Model, DCM）学习笔记
date: 2020-04-20
permalink: /data-mining-dcm-two.html
tags:
 - 数据挖掘
 - 离散选择模型
categories:
 - 数据挖掘
---




## 案例介绍

申请学校时，什么样的学生容易被录取

## 数据介绍

  1. 原始数据存储在`Application.csv`中
  2. 3个自变量： 

    * `gre`：GRE成绩（连续变量）
    * `gpa`：平均绩点（连续变量）
    * `rank` ：学校排名（离散变量）
  3. 1个因变量： 

    * `admit`：值为1表示录取，值为0表示拒绝（二分类变量）

## EDA


​    
    # 导入包
    import pandas as pd
    import numpy as np
    import statsmodels.api as sm
    import pylab as pl
    import warnings
    
    warnings.filterwarnings('ignore')
    %matplotlib inline


​    
​    
    # 载入数据
    data = pd.read_csv('Application.csv')
    data.head()


| admit | gre | gpa | rank  
---|---|---|---|---  
0 | 0 | 380 | 3.61 | 3  
1 | 1 | 660 | 3.67 | 3  
2 | 1 | 800 | 4.00 | 1  
3 | 1 | 640 | 3.19 | 4  
4 | 0 | 520 | 2.93 | 4  
      
    
    ## pandas中有系统变量名为rank，为防止产生混淆，将原始的rank修改为sch_rank
    data['sch_rank'] = data['rank']
    del data['rank']
    data.describe()


| admit | gre | gpa | sch_rank  
---|---|---|---|---  
count | 400.000000 | 400.000000 | 400.000000 | 400.00000  
mean | 0.317500 | 587.700000 | 3.389900 | 2.48500  
std | 0.466087 | 115.516536 | 0.380567 | 0.94446  
min | 0.000000 | 220.000000 | 2.260000 | 1.00000  
25% | 0.000000 | 520.000000 | 3.130000 | 2.00000  
50% | 0.000000 | 580.000000 | 3.395000 | 2.00000  
75% | 1.000000 | 660.000000 | 3.670000 | 3.00000  
max | 1.000000 | 800.000000 | 4.000000 | 4.00000  
      
    
    # 交叉频数分析：观察自变量和因变量之间的关系
    pd.crosstab(data['admit'], data['sch_rank'], rownames=['admit'])


sch_rank | 1 | 2 | 3 | 4  
---|---|---|---|---  
admit |  |  |  |  
0 | 28 | 97 | 93 | 55  
1 | 33 | 54 | 28 | 12  


    pd.crosstab(data['admit'], data['gre'], rownames=['admit'])


gre | 220 | 300 | 340 | 360 | 380 | 400 | 420 | 440 | 460 | 480 | ... | 620 |
640 | 660 | 680 | 700 | 720 | 740 | 760 | 780 | 800  
---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  
admit |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  
0 | 1 | 2 | 3 | 4 | 8 | 9 | 7 | 8 | 10 | 10 | ... | 18 | 16 | 12 | 11 | 17 | 8
| 7 | 1 | 1 | 14  
1 | 0 | 1 | 1 | 0 | 0 | 2 | 0 | 2 | 4 | 6 | ... | 12 | 5 | 12 | 9 | 5 | 3 | 4
| 4 | 4 | 11  
2 rows × 26 columns


​    
    pd.crosstab(data['admit'], data['gpa'], rownames=['admit'])


gpa | 2.26 | 2.42 | 2.48 | 2.52 | 2.55 | 2.56 | 2.62 | 2.63 | 2.65 | 2.67 |
... | 3.90 | 3.91 | 3.92 | 3.93 | 3.94 | 3.95 | 3.97 | 3.98 | 3.99 | 4.00  
---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  
admit |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  
0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | ... | 2 | 1 | 2 | 1 | 4 | 1 | 1 |
0 | 2 | 15  
1 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 1 | ... | 1 | 0 | 0 | 0 | 1 | 4 | 0 |
1 | 1 | 13  
2 rows × 132 columns

pandas.crosstab(index, columns, rownames=None) \- index：行中要分组的值 \-
columns：列中要分组的值 \- rownames：行的名称（意思是每一行的名称来自哪里） 由上述分析，大致可以发现： \-
申请者来自的学校排名靠前，则录取的比例相对较大 \- 从显示出来的gre和gra数据，和录取比列的关系不是特别明显


​    
    # 直方图可视化
    data.hist()


![在这里插入图片描述](https://img-blog.csdnimg.cn/20200406153719945.png)
从图可知，`gra`、`gre`和`sch_rank`大致服从正态分布，`admit`中拒绝的比例较高。

## 特征工程

  1. onehot编码 

    * 对分类变量`sch_rank`进行哑变量转化
    * 以`sch_rank_4`为参考


​    
​    
    data['sch_rank'].value_counts()


​    
​    
    2    151
    3    121
    4     67
    1     61
    Name: sch_rank, dtype: int64


`sch_rank`中只有4个取值，值为1的时候表示排名最高，这个排民特征可能已经做过分桶处理，分成了以上四类。


​    
    dummy_ranks = pd.get_dummies(data['sch_rank'], prefix='sch_rank')  # prefix指变化后的名称基准
    dummy_ranks.head()


| sch_rank_1 | sch_rank_2 | sch_rank_3 | sch_rank_4  
---|---|---|---|---  
0 | 0 | 0 | 1 | 0  
1 | 0 | 0 | 1 | 0  
2 | 1 | 0 | 0 | 0  
3 | 0 | 0 | 0 | 1  
4 | 0 | 0 | 0 | 1  
      
    
    # ix：基于标签位置的索引器
    # 所有行，从开始到sch_rank_3列
    dummy_ranks.ix[:,:'sch_rank_3']


| sch_rank_1 | sch_rank_2 | sch_rank_3  
---|---|---|---  
0 | 0 | 0 | 1  
1 | 0 | 0 | 1  
2 | 1 | 0 | 0  
3 | 0 | 0 | 0  
4 | 0 | 0 | 0  
... | ... | ... | ...  
395 | 0 | 1 | 0  
396 | 0 | 0 | 1  
397 | 0 | 1 | 0  
398 | 0 | 1 | 0  
399 | 0 | 0 | 1  
400 rows × 3 columns


​    
    # 合并数据
    del data['sch_rank']
    data = data.join(dummy_ranks.ix[:,:'sch_rank_3'])
    data.head()


| admit | gre | gpa | sch_rank_1 | sch_rank_2 | sch_rank_3  
---|---|---|---|---|---|---  
0 | 0 | 380 | 3.61 | 0 | 0 | 1  
1 | 1 | 660 | 3.67 | 0 | 0 | 1  
2 | 1 | 800 | 4.00 | 1 | 0 | 0  
3 | 1 | 640 | 3.19 | 0 | 0 | 0  
4 | 0 | 520 | 2.93 | 0 | 0 | 0  

  2. 手动添加常数项 

    * statsmodels库中的Logit() 函数不会自动添加常数项


​    
​    
    data['intercept'] = 1.0
    data.head()


| admit | gre | gpa | sch_rank_1 | sch_rank_2 | sch_rank_3 | intercept  
---|---|---|---|---|---|---|---  
0 | 0 | 380 | 3.61 | 0 | 0 | 1 | 1.0  
1 | 1 | 660 | 3.67 | 0 | 0 | 1 | 1.0  
2 | 1 | 800 | 4.00 | 1 | 0 | 0 | 1.0  
3 | 1 | 640 | 3.19 | 0 | 0 | 0 | 1.0  
4 | 0 | 520 | 2.93 | 0 | 0 | 0 | 1.0  

  3. 提取数据


​    
    data.describe()


| admit | gre | gpa | sch_rank_1 | sch_rank_2 | sch_rank_3 | intercept  
---|---|---|---|---|---|---|---  
count | 400.000000 | 400.000000 | 400.000000 | 400.000000 | 400.000000 |
400.000000 | 400.0  
mean | 0.317500 | 587.700000 | 3.389900 | 0.152500 | 0.377500 | 0.302500 | 1.0  
std | 0.466087 | 115.516536 | 0.380567 | 0.359955 | 0.485369 | 0.459916 | 0.0  
min | 0.000000 | 220.000000 | 2.260000 | 0.000000 | 0.000000 | 0.000000 | 1.0  
25% | 0.000000 | 520.000000 | 3.130000 | 0.000000 | 0.000000 | 0.000000 | 1.0  
50% | 0.000000 | 580.000000 | 3.395000 | 0.000000 | 0.000000 | 0.000000 | 1.0  
75% | 1.000000 | 660.000000 | 3.670000 | 0.000000 | 1.000000 | 1.000000 | 1.0  
max | 1.000000 | 800.000000 | 4.000000 | 1.000000 | 1.000000 | 1.000000 | 1.0  
      
    
    data.columns


​    
​    
    Index(['admit', 'gre', 'gpa', 'sch_rank_1', 'sch_rank_2', 'sch_rank_3',
           'intercept'],
          dtype='object')


​    
​    
    train_data = data[data.columns[1:]]
    train_data.columns


​    
​    
    Index(['gre', 'gpa', 'sch_rank_1', 'sch_rank_2', 'sch_rank_3', 'intercept'], dtype='object')


​    
​    
    test_data = data['admit']


## 建立模型


​    
    logit = sm.Logit(test_data, train_data)
    result = logit.fit()


​    
​    
    Optimization terminated successfully.
             Current function value: 0.573147
             Iterations 6


​    
​    
    result.summary()


Logit Regression Results Dep. Variable: | admit |  No. Observations:  |  400  
---|---|---|---  
Model: | Logit |  Df Residuals:  |  394  
Method: | MLE |  Df Model:  |  5  
Date: | Mon, 06 Apr 2020 |  Pseudo R-squ.:  | 0.08292  
Time: | 15:05:23 |  Log-Likelihood:  |  -229.26  
converged: | True |  LL-Null:  |  -249.99  
Covariance Type: | nonrobust |  LLR p-value:  | 7.578e-08  
| coef | std err | z | P>|z| | [0.025 | 0.975]  
---|---|---|---|---|---|---  
gre |  0.0023 |  0.001 |  2.070 |  0.038 |  0.000 |  0.004  
gpa |  0.8040 |  0.332 |  2.423 |  0.015 |  0.154 |  1.454  
sch_rank_1 |  1.5515 |  0.418 |  3.713 |  0.000 |  0.733 |  2.370  
sch_rank_2 |  0.8760 |  0.367 |  2.389 |  0.017 |  0.157 |  1.595  
sch_rank_3 |  0.2113 |  0.393 |  0.538 |  0.591 |  -0.559 |  0.981  
intercept |  -5.5414 |  1.138 |  -4.869 |  0.000 |  -7.772 |  -3.311  

## 结果分析

  1. 模型形式

$$log it = ln(p_1 / p_0) =
-5.5414+0.0023gre+0.8040gpa+1.5515(sch_rank=1)+0.8760(sch_rank=2)$$
因为sch_rank_3的p值为0.591，不显著，所以舍去此特征。

  2. 系数解读 

    * 当其他变量保持不变时，申请者GRE成绩每增加1分，其被录取的对数$ln({p_1} / {p _0})$增加0.0023，即胜率Odds变为原来的$e^{0.0023}=1.002$倍
    * 当其他变量保持不变时，申请者GPA每增加1个绩点，其被录取的胜率变为原来的2.23倍，符合常理，通常满绩点才为4或者5
    * 当其他变量保持不变时，申请者的学校排名为1的时候，相较于来自学校排名为4的申请者，其被录取的胜率变为原来的4.72倍；当申请者的学校排名为2的时候，对应倍数为2.40倍，均符合常理


​    
​    
    # 求各个系数的指数值
    np.exp(result.params)


​    
​    
    gre           1.002267
    gpa           2.234545
    sch_rank_1    4.718371
    sch_rank_2    2.401325
    sch_rank_3    1.235233
    intercept     0.003921
    dtype: float64


​    
​    
    # 输出Odds和95%置信区间
    result.conf_int()  # 返回拟合参数的置信区间，0表示区间下限，1表示区间上限


| 0 | 1  
---|---|---  
gre | 0.000120 | 0.004409  
gpa | 0.153684 | 1.454392  
sch_rank_1 | 0.732529 | 2.370399  
sch_rank_2 | 0.157233 | 1.594808  
sch_rank_3 | -0.558726 | 0.981245  
intercept | -7.772024 | -3.310862  
      
    
    conf = result.conf_int()
    conf['Odds'] = result.params
    conf.columns = ['区间下限','区间上限','Odds值']
    np.exp(conf)  # 需要做指数变换


| 区间下限 | 区间上限 | Odds值  
---|---|---|---  
gre | 1.000120 | 1.004418 | 1.002267  
gpa | 1.166122 | 4.281877 | 2.234545  
sch_rank_1 | 2.080335 | 10.701658 | 4.718371  
sch_rank_2 | 1.170269 | 4.927383 | 2.401325  
sch_rank_3 | 0.571937 | 2.667776 | 1.235233  
intercept | 0.000421 | 0.036485 | 0.003921  

## 问题记录

  1. result.summary()中各个指标的含义

> 参考：https://zhuanlan.zhihu.com/p/27699336

