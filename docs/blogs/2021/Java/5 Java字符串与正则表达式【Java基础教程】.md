---
title: Java学习之Java字符串与正则表达式
date: 2020-11-24
permalink: /java-learning-string-lambda.html
tags:
 - Java
categories:
 - Java
---



## 字符

  1. 字符类型 
        1. char
            2. char[]
  2. 字符型与整型的相互转化 
        1. ASCII码
  3. 字符包装类型 
        1. `Character character = 'A'`
            2. 字符处理方法 
      1. isDigit
      2. isLetter
      3. isLowerCase
      4. isSpaceChar
      5. isWhitespace
      6. toUpperCase

## 字符串

  1. 赋值与转化 
        1. 赋值：String

            2. 转化 
       
                String number = "1234";
        Integer packInt = Integer.parseInt(number);
       

        3. 超大数字赋值的问题 
            
                String bigNumber = "79879486239846389573905783084252345252";
        BigInteger bigInt = new BigInteger(bigNumber);
       
  2. 字符串格式化 
        1. 字符串子串 
       
                System.out.prinln(String.format("字符串：%s", name))
       

        2. 浮点数 
            
                String.format("%.8f", 3.1415926451)  // 保留八位，默认是六位
        String.format("%8d", 255)            // 八位，右对齐
        String.format("%-8d", 255)           // 八位，左对齐
        String.format("%08d", 255)           // 八位，左补0
       
  3. 判断字符串是否具备某种特征 
        1. isEmpty()
            2. equals()
                3. startsWith()
                    4. endsWith()
                        5. contains()
  4. 在字符串内部根据条件定位 
        1. charAt()
            2. indexOf()
                3. lastIndexOf()
  5. 根据某种规则修改字符串内容 
        1. toUpperCase()
            2. trim()：起吊首尾的空格
                3. concat()：在末尾添加字符串
                    4. substring()：字符串截断
                        5. replace()：替换

## 正则表达式

  1. 利用正则串分隔字符 
        1. split的输入参数应该是一个字符串，像`.`和`|`这两个字符，均需要转义，还有很多字符需要转义
            2. 正则保留字符：`() [] {} | - . + * \`
                3. “或”运算的优先级不如圆括号，所以遇到复杂一点的“或”运算，应当把圆括号放在整个逻辑运算式子的外面
                    4. `\\d`表示一位数字，`\\d{3}`表示三位数字
  2. 正则表达式 
        1. 处理字符串格式的一种逻辑式子，利用若干保留字符定义匹配规则，通过一个式子来覆盖满足上述规则的所有字符串
            2. 举例，`"\\d{3}([0-9xX])"`可用于身份证后四位的验证

## 实例


​    
    // 字符串与正则表达式
    // 提出字符串中的姓名、电话和详细的地址
    
    package com.jiangsu.nanjing;
    
    public class Test5 {
        public static void main(String[] args) {
    //        oneAddress();
            moreAddress();
        }
    
        private static void moreAddress(){
            String[] infoArray = new String[]{
                    "张三 159612458696 北京市海淀区双清路30号",
                    "05910000000,福建省福州市闽侯县上街镇工贸路3号,李四",
                    "11900000000 王五 四川省凉山彝族自治州西昌市大水井12号",
                    "西藏自治区阿里地区格尔县狮泉河镇26号,赵柳 18805166900"
            };
    
            for (String info : infoArray){
                // 分隔出姓名，电话和全部的地址
                String[] splits = info.split(" |,");
                String name = "", phone="", address="";
                for (String str : splits){
                    if (isPhone(str)){
                        phone = str;
                    }else if (name.equals("")){
                        name = str;
                    }else if (str.length() > name.length()){
                        address = str;
                    }else {
                        address = name;
                        name = str;
                    }
                }
                // 详细分隔地址
                String[] areaArray = new String[] {"", address};
                areaArray = getAreaName(areaArray[1], new String[]{"省", "自治区"});
                String province = areaArray[0];
                areaArray = getAreaName(areaArray[1], new String[]{"自治州", "地区", "盟", "市"});  //areaArray[1]表示除去省份后剩下的地址
                String city = areaArray[0];
                areaArray = getAreaName(areaArray[1], new String[]{"县", "市", "区", "旗"});  //areaArray[1]表示除去省份和城市后剩下的地址
                String district = areaArray[0];
                String detail = areaArray[1];  // 剩下的详细地址
                if (province.length() <= 0){   // 直辖市的情况
                    province = city;
                }
    
                System.out.println(String.format("姓名：%s, 电话：%s, 地址：%s", name, phone, address));
                System.out.println(String.format("省份：%s，地市：%s， 区县：%s，详细地址：%s", province, city, district, detail));
            }
        }
    
        private static void oneAddress(){
            String info = "张三 159612458696 北京市海淀区双清路30号";
            String[] splits = info.split(" |, ");
            String name = "", phone="", address="";
            for (String str : splits){
                if (isPhone(str)){
                    phone = str;
                }else if (name.equals("")){
                    name = str;
                }else if (str.length() > name.length()){
                    address = str;
                }else {
                    address = name;
                    name = str;
                }
            }
            System.out.println(String.format("姓名：%s, 电话：%s, 地址：%s", name, phone, address));
        }
    
        private static boolean isPhone(String phone){
            String regex = "\\d+";
            return phone.matches(regex);
        }
    
        private static String[] getAreaName(String address, String[] suffixArray){
            String[] areaArray = new String[] {"", address};
            int pos = 0;
            for (String suffix : suffixArray){
                pos = address.indexOf(suffix);
                if (pos > 0){
                    areaArray[0] = address.substring(0, pos+suffix.length());  //提取完整的省份，比如福建省
                    areaArray[1] = address.substring(pos+suffix.length());     //保留剩下的地址
                    break;
                }
            }
            return areaArray;
        }
    
    }


​    

