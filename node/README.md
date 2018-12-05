config配置文件目录，controllers控制层具体逻辑目录，routes路由管理，app.js入口文件。down.conf是nginx配置文件。

在node目录下，执行命令`npm install`安装项目依赖，使用node app.js即可启动后端项目。

使用node app.js启动项目不能够后台运行，关闭终端窗口后端项目就停止了。使用pm2来启动。

执行命令`npm install -g pm2`全局安装pm2，然后在node目录下执行`pm2 start app.js`即可以后台形式启动项目。
