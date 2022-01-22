---
title: Python学习之PyCharm中设置显示DataFrame的全部内容和忽略warning
date: 2020-11-05
permalink: /python-learning-pycharm-dataframe-warning.html
tags:
 - Python
 - DataFrame
 - Warning 
categories:
 - Python

---





## 显示DataFrame的全部内容


​    
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', None)
    pd.set_option('display.max_rows', None)


## 忽略warning


​    
    import warnings
    warnings.filterwarnings('ignore')

