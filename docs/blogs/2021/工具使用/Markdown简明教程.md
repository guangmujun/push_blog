---
title: Markdown简明教程
date: 2019-08-14
permalink: /tool-use-markdown-simple-use.html
tags:
 - 工具
 - Markdown
categories:
 - 工具

---

@[toc]

### 介绍

Markdown 是一种标记语言 有很多编辑器支持Markdown语法 这里推荐 [Typora](https://typora.io/)

* * *

以下是常用MarkDown语法的整理

### 目录

在大标题下输入 [TOC] 然后按下回车即可自动生成目录（部分编辑器支持）

### 标题

#一级标题 ## 二级标题 以此类推

### 列表

`-`加空格生成无序列表 `1.`加空格生成有序列表

### 引用

只需要在文本前加入 `>` 这种尖括号（大于号）即可，效果如下

> 引用自CSDN

### 图片和链接

  1. 图片直接拖进来,需要将图片实际复制到本地，不然文件打开关闭后图片会显示出错

  2. 图片链接 `![](图片链接地址)`

  3. 链接 [Baidu](http://www.baidu.com) (按住Ctrl后点击可访问) `[链接](http://www.baidu.com)`

### 粗体和斜体

_斜体_ **粗体** * 这样是斜体 * ** 这样是粗体 **

### 代码


​    
    ````的效果如下


`This is my code.` 英文输入下的`键


​    
    代码段输入 ```然后回车，出现代码块


### 分割线

* * *

 连续输入三个--- ，然后回车

### 表格

 按住Ctrl+T插入表格  |  |  
---|---|---  
|  |  
|  |  
|  |  

### 公式

  * 行间公式

$$ 声速=340 \frac{m}{s}=340\frac{100cm}{1000000\mu s}=0.034cm/\mu s $$ ​
输入$$后回车，或者按下Ctrl+shfit+M弹出公式编辑框

  * 行内公式 $$之间写公式即可 质能方程： $E = mc^2$ 

**分数** ：`\frac{分子}{分母}` **根号** :`\sqrt[次数]{被开方数}` **多个下标**
：多个下标的值放到｛｝中，$$P_{ikabcfdd}$$ **平均数** ：\overline $$\overline P_i$$ $$\overline
{a+b+c+d}$$ **求和** :\sum_下标^上标 $$\sum_1^n ni$$ **希腊字母** ：  代码 | 大写 | 代码 | 小写  
---|---|---|---  
`A` | AA | `\alpha` | αα  
`B` | BB | `\beta` | ββ  
`\Gamma` | ΓΓ | `\gamma` | γγ  
`\Delta` | ΔΔ | `\delta` | δδ  
`E` | EE | `\epsilon` | ϵϵ  
`Z` | ZZ | `\zeta` | ζζ  
`H` | HH | `\eta` | ηη  
`\Theta` | ΘΘ | `\theta` | θθ  
`I` | II | `\iota` | ιι  
`K` | KK | `\kappa` | κκ  
`\Lambda` | ΛΛ | `\lambda` | λλ  
`M` | MM | `\mu` | μμ  
`N` | NN | `\nu` | νν  
`\Xi` | ΞΞ | `\xi` | ξξ  
`O` | OO | `\omicron` | οο  
`\Pi` | ΠΠ | `\pi` | ππ  
`P` | PP | `\rho` | ρρ  
`\Sigma` | ΣΣ | `\sigma` | σσ  
`T` | TT | `\tau` | ττ  
`\Upsilon` | ΥΥ | `\upsilon` | υυ  
`\Phi` | ΦΦ | `\phi` | ϕϕ  
`X` | XX | `\chi` | χχ  
`\Psi` | ΨΨ | `\psi` | ψψ  
`\Omega` | ΩΩ | `\omega` | ω  
**关系运算符** ：  符号 | 代码  
---|---  
± | `\pm`  
× | `\times`  
÷ | `\div`  
∣ | `\mid`  
∤ | `\nmid`  
⋅ | `\cdot`  
∘ | `\circ`  
∗ | `\ast`  
⨀ | `\bigodot`  
⨂ | `\bigotimes`  
⨁ | `\bigoplus`  
≤ | `\leq`  
≥ | `\geq`  
≠ | `\neq`  
≈ | `\approx`  
≡ | `\equiv`  
∑ | `\sum`  
∏ | `\prod`  
∐ | `\coprod`  
**集合运算符** :  符号 | 代码  
---|---  
∅∅ | `\emptyset`  
∈∈ | `\in`  
∉∉ | `\notin`  
⊂⊂ | `\subset`  
⊃⊃ | `\supset`  
⊆⊆ | `\subseteq`  
⊇⊇ | `\supseteq`  
⋂⋂ | `\bigcap`  
⋃⋃ | `\bigcup`  
⋁⋁ | `\bigvee`  
⋀⋀ | `\bigwedge`  
⨄⨄ | `\biguplus`  
⨆⨆ | `\bigsqcup`  
**对数运算符** :  符号 | 代码  
---|---  
loglog | `\log`  
lglg | `\lg`  
lnln | `\ln`  
**三角运算符** :  符号 | 代码  
---|---  
⊥⊥ | `\bot`  
∠∠ | `\angle`  
sinsin | `\sin`  
coscos | `\cos`  
tantan | `\tan`  
cotcot | `\cot`  
secsec | `\sec`  
csccsc | `\csc`  
**微积分运算符** :  符号 | 代码  
---|---  
′′ | `\prime`  
∫∫ | `\int`  
∬∬ | `\iint`  
∭∭ | `\iiint`  
∬∬⨌ | `\iiiint`  
∮∮ | `\oint`  
limlim | `\lim`  
∞∞ | `\infty`  
∇∇ | `\nabla`  
dd | `\mathrm{d}`

