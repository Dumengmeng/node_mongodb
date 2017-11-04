######## 该项目是根据慕课网-Node.js+MongoDB建站攻略（一期&二期）学习所记录的代码(视频地址：http://www.imooc.com/learn/75)，并可以成功运行，中间添加了自己学习过程中对不明白的地方查看文档所得的注释，及mongodb操作过程中遇到的问题和解决办法，希望会对刚开始接触mongodb的你有所帮助。（若有问题欢迎联系15637572224@163.com ^_^）

######## 默认已安装node

######## 安装初始依赖(注意要将bower.json和package.json下载到本地)
npm install 
npm install brower -g
bower install

######## mongodb安装
#1）访问链接https://www.mongodb.com/download-center#community，页面会自动检测当前系统配置并提示下载入口，点击下载即可（过程会稍漫长，建议chrome浏览器下载）；
#2）这里有详细的安装步骤http://www.runoob.com/mongodb/mongodb-window-install.html
#3）需要说明的是，安装步骤里有这一条："将MongoDB服务器作为Windows服务运行"，我们在bin目录下打开cmd，执行命令  -------->>>>  mongod.exe --bind_ip yourIPadress --logpath "C:\data\dbConf\mongodb.log" --logappend --dbpath "C:\data\db" --port yourPortNumber --serviceName "YourServiceName" --serviceDisplayName "YourServiceName" --install” <<<<------  时，切记把变量“--dbpath”、“--port”的值替换为我们本地的目录和端口号，端口号建议不进行设置，“--serviceName”、“--serviceDisplayName”的值建议替换为“MongoDB”，方面识别。（如果我们没有在启动电脑系统时同时启动数据库服务器这样的需求时，完全可不比进行这一步操作）
#4）双击bin目录下的mongod.exe，启动MongoDB 服务器（执行完本步骤，便可启动该项目的服务器并进行数据库的操作了）
#5）双击bin目录下的mongo.exe，启动MongoDB Shell脚本，可直接进行数据库操作，比如我们可执行下边两条命令，查看我们在该项目里存储在movies数据库里边的数据：a、use movies   b、db.movies.find().pretty()
#注：如果我们是第一次安装mongodb，则在运行该项目前，需要先使用MongoDB Shell脚本执行use movies命令，来创建一个movies数据库

######## 项目测试连接
首页：http://localhost:3001/
详情页：http://localhost:3001/movie/:id
列表页：http://localhost:3000/admin/list
后台录入页：http://localhost:3001/admin/movie

#注：
#项目保留了模拟的数据，方便我们在没有安装mongodb的情况下去运行此项目的代码
#项目运行的时候可能会报错：index.jade第14行少空格（目前还没解决，但不影响项目执行）
#app.js里边，在链接数据库时，需设置useMongoClient: true，否则会报错


#项目二期
npm install grunt -g
npm install grunt-cli -g
npm install grunt-contrib-watch --save-dev
npm install grunt-nodemon --save-dev
npm install grunt-concurrent --save-dev

## 直接执行grunt便可启动服务，并跟随文档的更新自启动服务

#功能添加：
1、新增评论功能；
    1）评论的登录校验；
    2）用户之间的相互评论；
    3）多级评论的展示；



