---
title: 微信小程序页面间传递json数据
date: 2019-08-14
permalink: /wechat-little-program-change-json-data.html
tags:
 - 微信小程序
 - Json
categories:
 - 微信小程序
---



**1.页面跳转函数** wx.navigateTo(Object object) 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar
页面。使用 wx.navigateBack 可以返回到原页面。 示例代码：


​    
    wx.navigateTo({
      url: 'test?id=1'
    })


​    
​    
    wx.navigateTo({
      url: 'test?id='+value
    })


其中test为要跳转到的页面，id为参数值 **2.数据格式转换** url传参数数据时候，如果传送的参数值是一个json数据，需要对数据进行一定的处理

  * JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  * JSON.parse() 方法用于将一个 JSON 字符串转换为对象。

实现从PageA跳转到PageB，同时传递json数据。 PageA:


​    
    mydata = JSON.stringify(mydata)                             //将json数据字符串化
              wx.navigateTo({                                   //页面跳转，传递字符串参数
                url: '../addBook/addBook?value='+mydata,      
              })


PageB:


​    
    onLoad: function (options) {
        var that = this
        that.setData({                                          //将传递来的json字符串序列化为Json格式
          bookInfo: JSON.parse(options.value)                   //然后将值赋给bookInfo
        })
        // console.log(JSON.parse(options.value))               //检验传递过来的参数
      },

