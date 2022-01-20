---
title: ADB操作模拟器
date: 2021-12-21
permalink: /adb-phone.html
tags:
 - 工具
ADB
categories:
 - 工具

---

## ADB操作

### 屏幕上滑脚本

```python
import time
import subprocess
import random

host = "127.0.0.1"
port = "21503"


def connect():
    connect_cmd = "adb connect " + host + ":" + port
    return subprocess.run(connect_cmd, shell=True)


def move_up():
    state = connect()
    print("State: ", state)
    
    ope_num = random.randint(200, 500)
    for i in range(ope_num):
        watch_time = random.randint(2, 20)
        print("观看 %s / %s 视频 %s 秒" %(i, ope_num, watch_time))
        
        x1 = random.randint(400, 600)
        y1 = random.randint(600, 800)
        x2 = random.randint(400, 600)
        y2 = random.randint(200, 400)
        coor_str = " ".join([str(x1), str(y1), str(x2), str(y2)])
        swipe_cmd = "adb -s " + host + ":" + port + " shell input swipe " + coor_str
        subprocess.run(swipe_cmd, shell=True)
        time.sleep(watch_time) 
        


if __name__ == "__main__":
    move_up()
```

### 启动脚本sh

```shell
python 1Swipe.py  2>&1 | tee '1Swipe.log' &
python 2Swipe.py  2>&1 | tee '2Swipe.log' &
wait
echo 'Done!'
```



## 模拟器

### 逍遥模拟器

**1、查看端口号**

`D:\Software\Microvirt\MEmu\MemuHyperv VMs`

软件安装目录下，新开几个模拟器，则这个文件夹中会新建对应数量的文件夹

打开其中一个文件夹，用文本编辑器打开`MEmu.memu-prev`文件

找到这一句`<Forwarding name="ADB" proto="1" hostip="127.0.0.1" hostport="21503" guestip="10.0.2.15" guestport="5555"/>`

可知其端口号为21503

注意：每次多开一个模拟器，模拟器启动后，查看对应文件中，其对应的端口才会变化，通常是

21503 -> 21513 -> 21523 -> 21533 ....

### 夜神模拟器

**1、查看端口号**

`D:\Software\Nox\bin\BignoxVMS`

软件安装目录下，新开几个模拟器，则这个文件夹中会新建对应数量的文件夹

打开其中一个文件夹，用文本编辑器打开`nox.vbox-prev`文件

找到这一句`<Forwarding name="port2" proto="1" hostip="127.0.0.1" hostport="62001" guestport="5555"/>`

可知其端口号为62001

**2、存在问题**

当日下载快手极速版可正常使用，次日再次打开快手极速版，无法打开。