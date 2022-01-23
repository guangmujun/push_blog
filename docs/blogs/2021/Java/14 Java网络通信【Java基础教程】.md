---
title: Java学习之Java网络通信
date: 2020-12-29
permalink: /java-learning-network.html
tags:
 - Java
categories:
 - Java
---



## 网络交互的数据格式

  * URL：只能进行简单的键值对参数传递
  * JSON：可以传递结构化数据，数组形式的参数
  * XML：出了传输字符串文本外，还可以传输特征属性

### URL

  1. Uniform Resource Locator，统一资源定位符

  2. `https://www.news.cn:8080/public/getvalidatecode?time=123#index`

  * `https`：协议
  * `www.news.cn:8080`：授权 = 域名+端口
  * `public/getvalidatecode?time=123`: 文件名称 = 路径+请求参数
  * `#index`：引用位置，自动滚动到指定位置的区域

  3. HTTP网络协议

  * Hypertext Transfer Protocol，超文本传输协议

  4. URL编码与解码

  5. 检测域名的连通性 
        
        package com.jiangsu.nanjing;

    import java.net.InetAddress;
    import java.net.UnknownHostException;
    
    public class TestAddress {
       public static void main(String[] args){
           boolean res = testHost("www.baidu.com");
           System.out.println(res);
       }
    
       private static boolean testHost(String host){
           try{
               //根据域名或IP获得对应的网络地址对象
               InetAddress inet = InetAddress.getByName(host);
           }catch (UnknownHostException e){
               e.printStackTrace();
               return false;
           }
           return true;
       }
    }


​    

### JSON

  1. Java的开发包中没有处理JSON的工具，添加第三方JAR：阿里巴巴的FastJson

  2. JSON数组通过方括号表达，方括号内部以此罗列各个元素，具体格式：`数组的键明：[元素1，元素2，元素3]`

  3. JSON文件的解析 
        
        package com.jiangsu.nanjing;

    import com.alibaba.fastjson.JSONArray;
    import com.alibaba.fastjson.JSONObject;
    
    public class TestJson {
       public static void main(String[] args){
           String json = "{\n" +
                   "  \"user_info\": {\n" +
                   "    \"name\": \"siwuxie\",\n" +
                   "    \"address\": \"taohuadaoshuiliandong123hao\",\n" +
                   "    \"phone\": \"79867786987\"\n" +
                   "  },\n" +
                   "  \"goods_list\": [\n" +
                   "    {\n" +
                   "      \"goods_name\": \"Mate30\",\n" +
                   "      \"goods_number\": 1,\n" +
                   "      \"goods_price\": 8888\n" +
                   "    },\n" +
                   "    {\n" +
                   "      \"goods_name\": \"gelizhongyangkongtiao\",\n" +
                   "      \"goods_number\": 1,\n" +
                   "      \"goods_price\": 58000\n" +
                   "    },\n" +
                   "    {\n" +
                   "      \"goods_name\": \"hongqintingpixie\",\n" +
                   "      \"goods_number\": 3,\n" +
                   "      \"goods_price\": 999\n" +
                   "    }\n" +
                   "  ]\n" +
                   "}";
           testParserJson(json);
       }
    
       private static GoodsOrder testParserJson(String json){
           GoodsOrder order = new GoodsOrder();
           JSONObject object = JSONObject.parseObject(json);
           JSONObject user_info = object.getJSONObject("user_info");
           order.user_info.name = user_info.getString("name");
           order.user_info.phone = user_info.getString("phone");
           order.user_info.address = user_info.getString("address");
           System.out.println(order.user_info.name);
    
           JSONArray good_list = object.getJSONArray("goods_list");
           for (int i=0; i<good_list.size(); i++){
               GoodsItem item = new GoodsItem();
               JSONObject goods_item = (JSONObject) good_list.get(i);
               item.goods_name = goods_item.getString("goods_name");
               item.goods_number = goods_item.getIntValue("goods_number");
               item.goods_price = goods_item.getDoubleValue("goods_price");
               System.out.println(item.goods_name);
               order.goods_list.add(item);  //往商品清单中添加指定商品对象
           }
    
           return order;
       }
    }


​    

  4. 自动转换，将JSON串自动转换成实体对象 
        
        private static GoodsOrder testParserJsonAgain(String json){
           JSONObject object = JSONObject.parseObject(json);
           GoodsOrder order = (GoodsOrder) JSONObject.toJavaObject(object, GoodsOrder.class);
           System.out.println(order.user_info.name);
           return order;
       }


  5. 实体对象转化为JSON串，一行代码 
        
        public static void main(String[] args){
           String json = "{\n" +
                   "  \"user_info\": {\n" +
                   "    \"name\": \"siwuxie\",\n" +
                   "    \"address\": \"taohuadaoshuiliandong123hao\",\n" +
                   "    \"phone\": \"79867786987\"\n" +
                   "  },\n" +
                   "  \"goods_list\": [\n" +
                   "    {\n" +
                   "      \"goods_name\": \"Mate30\",\n" +
                   "      \"goods_number\": 1,\n" +
                   "      \"goods_price\": 8888\n" +
                   "    },\n" +
                   "    {\n" +
                   "      \"goods_name\": \"gelizhongyangkongtiao\",\n" +
                   "      \"goods_number\": 1,\n" +
                   "      \"goods_price\": 58000\n" +
                   "    },\n" +
                   "    {\n" +
                   "      \"goods_name\": \"hongqintingpixie\",\n" +
                   "      \"goods_number\": 3,\n" +
                   "      \"goods_price\": 999\n" +
                   "    }\n" +
                   "  ]\n" +
                   "}";
           GoodsOrder order = testParserJsonAgain(json);
           String toJson = JSONObject.toJSONString(order);
           System.out.println(toJson);
       }


### XML

  1. eXtensible Markup Language，可扩展标记语言

  2. 在Java中传统的XML解析方式有，DOM和SAX两种，DOM把整个XML报文读进来，SAX根据节点名称从报文起点开始扫描，但是每次都要从头找起

  3. JDK集成了DOM和SAX，但其解析过程艰深晦涩，应用比较多的是XML解析工具第三方包Dom4j，遵循DOM规则

  4. 解析xml 
        1. 创建SAXReader阅读器对象
            2. 把字符串形式的XML报文转换为输入流对象
                3. 命令阅读器对象从输入流中读取Document文档对象
                    4. 获得文档对象的根节点Element
                        5. 从根节点往下依次解析每个层级的节点值
    
        package com.jiangsu.nanjing;

    import org.dom4j.Document;
    import org.dom4j.Element;
    import org.dom4j.io.SAXReader;
    
    import javax.xml.parsers.SAXParser;
    import java.io.ByteArrayInputStream;
    import java.io.InputStream;
    import java.nio.charset.Charset;
    import java.util.List;
    
    public class TestDom4j {
       public static void main(String[] args){
           String xml = "<?xml version=\"1.0\" encoding=\"GBK\" ?>\n" +
                   "<order>\n" +
                   "    <user_info>\n" +
                   "        <name type=\"String\">siwuxie</name>\n" +
                   "        <address type=\"String\">jkljljlkjl</address>\n" +
                   "        <phone type=\"String\">16546415</phone>\n" +
                   "    </user_info>\n" +
                   "    <goods_list>\n" +
                   "        <goods_item>\n" +
                   "            <goods_name type=\"String\">Mate30</goods_name>\n" +
                   "        </goods_item>\n" +
                   "        <goods_item>\n" +
                   "            <goods_name type=\"String\">gelikongtiao</goods_name>\n" +
                   "        </goods_item>\n" +
                   "    </goods_list>\n" +
                   "</order>";
           testParserByDom4j(xml);
       }
    
       private static GoodsOrder testParserByDom4j(String xml){
           GoodsOrder order = new GoodsOrder();
           SAXReader reader = new SAXReader();
           try (InputStream is = new ByteArrayInputStream(xml.getBytes())){
               Document document = reader.read(is);
               Element root = document.getRootElement();
               Element user_info = root.element("user_info");
               order.user_info.name = user_info.element("name").getText();
               System.out.println(order.user_info.name);
    
               List<Element> good_list = root.element("goods_list").elements();
               for (int i=0; i<good_list.size(); i++){
                   Element goods_item = good_list.get(i);
                   GoodsItem item = new GoodsItem();
                   item.goods_name = goods_item.element("goods_name").getText();
                   System.out.println(item.goods_name);
               }
           }catch (Exception e){
               e.printStackTrace();
           }
           return order;
       }
    }


​    

  5. 解析xml中的字段属性 
        
        private static void printValueAndAttr(Element parent, String node_name, String attr_name){
           Element element = parent.element(node_name);//获取父节点下指定名称的子节点
           String node_value = element.getText();//获取子节点的值
           String attr_value = "";
           Attribute attr = element.attribute(attr_name);//根据属性名称字段获取子节点的对应属性对象
           if (attr != null){
               attr_value = attr.getText();
           }
           System.out.println(attr_value);
       }


​    
        printValueAndAttr(user_info, "name", "type");


## HTTP接口访问

### GET

TCP/IP协议组：

  1. 协议分为三个层次： 
        1. 网络层：包括IP协议、ICMP、ARP
            2. 传输层：TCP、UDP
                3. 应用层：FTP、HTTP、TELNET、SMTP

实例：


​    
    //将输入流转化为字符串
    package com.jiangsu.nanjing;
    
    import java.io.IOException;
    import java.io.InputStream;
    
    public class StreamUtil {
        public static String isToString(InputStream is) throws IOException{
            byte[] bytes = new byte[is.available()];//创建临时存放的字节数组
            is.read(bytes);//从输入流中读取字节数组
            return new String(bytes);//把字节数组转换为字符串并返回
        }
    }


​    
​    
​    
    package com.jiangsu.nanjing;
    
    import java.net.HttpURLConnection;
    import java.net.URL;
    import java.util.stream.Stream;
    
    //对指定URL发起GET调用
    public class TestUrlConnection {
        public static void main(String[] args){
            testCallGet("http://www.weather.com.cn/data/sk/101010100.html");
    
        }
    
        private static void testCallGet(String callUrl){
            try {
                URL url = new URL(callUrl);//根据网址字符串构建URL对象
                //打开URL对象的网络连接，并返回HTTPURLConnection连接对象
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(5000);//连接的超时时间
                conn.setReadTimeout(5000);//读取应答数据的超时时间
                conn.connect();
                System.out.println(String.format("%d, %s, %s", 
                        conn.getContentLength(),//内容长度
                        conn.getContentType(),//内容类型
                        conn.getContentEncoding()));//压缩方式
                //从输入流中获取默认的字符串数据
                String content = StreamUtil.isToString(conn.getInputStream());
                System.out.println(String.format("%d, %s", conn.getResponseCode(), content));
                conn.disconnect();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }


​    

补充：

  * 字符编码或者数据压缩编码标准不同时，会出错
  * GET不仅支持从服务地址获取应答报文，而且支持直接下载网络文件

### POST

业务参数放到请求报文中,也支持上传文件


​    
    testCallPost("http://localhost:8080/test", "How are you?");


​    
​    
        private static void testCallPost(String callUrl, String body){
            try{
                URL url = new URL(callUrl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);
                conn.connect();
                OutputStream os = conn.getOutputStream();
                os.write(body.getBytes());
                System.out.println(String.format("%s, %s, %s", conn.getHeaderField("Content-Length"),
                        conn.getHeaderField("Content-Type"),
                        conn.getHeaderField("Content-Encoding")));
                String content = StreamUtil.getUnzipString(conn);
                System.out.println(String.format("%d, %s", conn.getResponseCode(), content));
                conn.disconnect();
            }catch (Exception e){
                e.printStackTrace();
            }
        }


​    
​    
    package com.jiangsu.nanjing;
    
    import java.io.ByteArrayOutputStream;
    import java.io.IOException;
    import java.io.InputStream;
    import java.net.HttpURLConnection;
    import java.util.zip.GZIPInputStream;
    
    public class StreamUtil {
        public static String isToString(InputStream is) throws IOException{
            byte[] bytes = new byte[is.available()];
            is.read(bytes);
            return new String(bytes);
        }
    
        public static String isToStringForLarge(InputStream is, String charset){
            String result = "";
            try(ByteArrayOutputStream baos = new ByteArrayOutputStream()){
                int i = -1;
                while ((i = is.read()) != -1){
                    baos.write(i);
                    byte[] data = baos.toByteArray();
                    result = new String(data, charset);
                }
            }catch (Exception e){
                e.printStackTrace();
            }
            return result;
        }
    
        public static String getUnzipString(HttpURLConnection conn) throws IOException{
            String contentType = conn.getContentType();
            String charset = "UTF-8";
            if (contentType != null){
                if (contentType.toLowerCase().contains("charset='gbk")){
                    charset = "GBK";
                }else if (contentType.toLowerCase().contains("charset=gb2312")){
                    charset = "GB2312";
                }
            }
            String contentEncoding = conn.getContentEncoding();
            InputStream is = conn.getInputStream();
            String result = "";
            if (contentEncoding != null && contentEncoding.contains("gzip")){
                try(GZIPInputStream gis = new GZIPInputStream(is)){
                    result = isToStringForLarge(gis, charset);
                }catch (Exception e){
                    e.printStackTrace();
                }
            }else {
                result = isToStringForLarge(is, charset);
            }
            return result;
        }
    }


​    
​    
    package com.jiangsu.nanjing;
    
    import com.sun.net.httpserver.HttpExchange;
    import com.sun.net.httpserver.HttpHandler;
    import com.sun.net.httpserver.HttpServer;
    import com.sun.net.httpserver.spi.HttpServerProvider;
    
    import java.io.ByteArrayOutputStream;
    import java.io.InputStream;
    import java.io.OutputStream;
    import java.net.InetSocketAddress;
    
    public class MyHttpHandler implements HttpHandler {
        public static void main(String[] args){
            startServer();
        }
    
        public static void startServer(){
            try {
                HttpServerProvider provider = HttpServerProvider.provider();
                HttpServer server = provider.createHttpServer(new InetSocketAddress(8080), 10);
                server.createContext("/test", new MyHttpHandler());
                server.setExecutor(null);
                server.start();
                System.out.println("Http Server Start");
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    
        public void handle(HttpExchange exchange){
            String  response = "I am fine, and you?";
            byte[] byteResp = response.getBytes();
            try(InputStream is = exchange.getRequestBody();
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                OutputStream os = exchange.getResponseBody();){
                int i = -1;
                while ((i = is.read()) != -1){
                    baos.write(i);
                }
                String request = baos.toString();
                System.out.println("Request:"+request);
                exchange.sendResponseHeaders(200, byteResp.length);
                os.write(byteResp);
                System.out.println("response:"+response);
            }catch (Exception e){
                e.printStackTrace();
            }
            exchange.close();
        }
    }


​    

### HttpClient

HttpURLConnection要求开发者掌握太多技术细节，Apache旗下的HttpClient封装了大部分的编码细节。从Java11开始，JDK新增了自己的HttpClient框架也可实现文件的下载和上传。

  * HttpClient：表示HTTP客户端，用于描述通用的客户端连接信息 
    
        HttpClient client = HttpClient.newHttpClient();


  * HttpRequest：表示HTTP请求过程，用于描述本次网络访问的请求信息 
    
        HttpRequest request = HttpRequest.newBuilder(URI.create(url)).build();


  * HttpResponse：表示HTTP应答过程

GET请求：


​    
    package com.jiangsu.nanjing;
    
    import java.net.URI;
    import java.net.http.HttpClient;
    import java.net.http.HttpHeaders;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;
    
    public class TestHttpClient {
        public static void main(String[] args){
            testCallGet("https://hq.sinajs.cn/list=s_sh000001");
        }
    
        private static void testCallGet(String url){
            HttpClient client = HttpClient.newHttpClient();
            //客户端传递请求信息，且返回字符串形式的应答报文
            HttpRequest request = HttpRequest.newBuilder(URI.create(url)).build();
            try {
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                HttpHeaders headers = response.headers();
                System.out.println(String.format("%s, %s, %s",
                        headers.firstValue("Content-Length").orElse(null),
                        headers.firstValue("Content-Type").orElse(null),
                        headers.firstValue("Content-Encoding").orElse(null)));
                System.out.println(String.format("%d, %s",
                        response.statusCode(), response.body()));
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }


​    

POST请求：


​    
    private static void testCallPost(String url, String body){
            System.out.println("request:+body");
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .header("Content-Type", "application/json").build();
            try{
                HttpResponse<String> response = client.send(request, HttpRequest.BodyPublishers.ofString());
                System.out.println(String.format("%d, %s", response.statusCode(), response.body()));
            }catch (Exception e){
                e.printStackTrace();
            }
        }


## 套接字Socket通信

  1. Socket:是一种支持TCP/IP协议的通信接口。

  2. 基于TCP协议（Transmission Control Protocol，传输控制协议）的Socket，在双方成功建立连接之后，不但可以传输文本，而且能够传输文件；基于UDP协议（User Datagram Protocol，用户数据报协议）的Socket，则无需确认连接即可传输数据 。

  3. HTTP协议不够灵活，具体表现在： 
        1. HTTP连接属于短连接，每次访问操作结束之后，客户端会关闭本次连接。
            2. 服务端总是被动接收消息，无法主动向客户端推送消息。
                3. 属于客户端与服务端一对一交互，完全与第三者无关。
                    4. 搭建专门的HTTP服务器，服务端比较重
  4. 套接字属于长连接，只要连接的双方未调用close防范，也没退出程序，则理论上都处于连接状态。
  5. TCP连接中，套接字的客户端需要给每个连接分配两个线程 
        1. 一个专门用来向服务端发送信息
            2. 一个专门用于从服务端接收信息
  6. UDP连接中，批量向一群目标设备发送消息，是一个单向过程

