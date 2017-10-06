/* 
 * 入口文件
 */
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("express-logger");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo")(session);
const port = process.env.PORT || 3001;
let app = express();
let dbUrl = "mongodb://localhost:27017/movies";

mongoose.connect(dbUrl, {
    // 大于4.11.0版本的数据库需要有此参数
    // 通过设置为true，使用新的mongoose连接逻辑
    useMongoClient: true
});

// 设置模板根目录
app.set("views", "./app/views/pages");
// 处理后台录入页的提交表单操作，提交表单时,将表单里的数据进行格式化
app.use(bodyParser.urlencoded({ extend: true }));
// 设置模板引擎
app.set("view engine", "jade");
// 在本地添加moment模块
app.locals.moment = require("moment");
app.use(cookieParser())
app.use(session({
        secret: "movie",
        store: new MongoStore({
            url: dbUrl,
            collection: "sessions"
        })
    }))
    // 样式使用bower_components下的资源
app.use(express.static(path.join(__dirname, "public")));
// 监听端口
app.listen(port);

if (app.get("env") === "development") {
    // 能够在屏幕上打印错误信息
    app.set("showStaticError", true);
    app.use(logger({ path: "/path/log.txt" }));
    // 源代码显示格式化之后的代码
    app.locals.pretty = true;
    // 打印数据库的操作信息
    mongoose.set("debug", true);
}

require("./config/routes")(app)

// 启动后打印日志
console.log("strted on port " + port);