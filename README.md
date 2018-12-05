# SealuDisk
##这是一个网盘，用户可以直接浏览到软件列表，但是需要验证手机之后才能下载。主要技术要点：
1. nginx的x-sendfile功能，因为软件可能有几个G的大小，避免对node造成大的影响。
2. node做接口和验证。
3. 腾讯云短信接口。
4. 前后端分离，目标是将静态文件放到免备案主机上，接口和需要下载的软件放在国内服务器上。如用户访问www.softdl.com，下载链接可以是http://a.b.xyz/download?id=1242423423&file=software.iso。
5. 软件列表存储在json文件中。

##node提供的主要rest接口：
1. 软件列表接口，不做验证，直接返回JSON文件。
2. 发送验证码接口，参数为用户输入的手机号，返回发送状态。
3. 下载接口，参数为手机号、验证码（可以做hash）和文件名，返回实际下载文件。

参考链接：
https://blog.csdn.net/qq_34839657/article/details/52812885
https://blog.csdn.net/w6299702/article/details/45576957
https://blog.csdn.net/liuzhenghi/article/details/7910801
https://www.lainme.com/doku.php/blog/2015/03/nginx的x-sendfile及防盗链设置
