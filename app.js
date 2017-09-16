/* 
 * 入口文件
 */
const express = require("express");
const path = require("path");
const _ = require("underscore");
const mongoose = require("mongoose");
const Movie = require("./models/movie");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3001;
let app = express();

mongoose.connect("mongodb://localhost:27017/movies", {
    // 大于4.11.0版本的数据库需要有此参数
    useMongoClient: true
});

// 设置模板根目录
app.set("views", "./views/pages");
// 处理后台录入页的提交表单操作，提交表单时,将表单里的数据进行格式化
app.use(bodyParser.urlencoded({ extend: true }));
// 设置模板引擎
app.set("view engine", "jade");
// 在本地添加moment模块
app.locals.moment = require("moment");
// 样式使用bower_components下的资源
app.use(express.static(path.join(__dirname, "public")));
// 监听端口
app.listen(port);

//路由
/* 
 * 首页
 */
app.get("/", function(req, res) {
    // 1、渲染模拟的数据
    // res.render("index", {
    //     title: "Hello 首页",
    //     movies: [{
    //         title: '肖申克的救赎',
    //         _id: 1,
    //         poster: 'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p480747492.jpgh'
    //     }, {
    //         title: '肖申克的救赎',
    //         _id: 2,
    //         poster: 'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p480747492.jpgh'
    //     }, {
    //         title: '肖申克的救赎',
    //         _id: 2,
    //         poster: 'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p480747492.jpgh'
    //     }, {
    //         title: '肖申克的救赎',
    //         _id: 3,
    //         poster: 'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p480747492.jpgh'
    //     }, {
    //         title: '肖申克的救赎',
    //         _id: 4,
    //         poster: 'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p480747492.jpgh'
    //     }, {
    //         title: '肖申克的救赎',
    //         _id: 5,
    //         poster: 'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p480747492.jpgh'
    //     }]
    // })

    // 2、渲染数据库的实际数据
    Movie.fetch(function(err, movies) {
        if (err) { console.log(err); }

        res.render("index", {
            title: "首页",
            movies: movies
        })
    })
});

/* 
 * 详情页
 */
app.get("/movie/:id", function(req, res) {
    // res.render("detail", {
    //     title: "Hello detail",
    //     movie: {
    //         doctor: '弗兰克·德拉邦特',
    //         country: '美国',
    //         title: '肖申克的救赎',
    //         year: 1994,
    //         poster: 'https://movie.douban.com/subject/1292052/?referer=baidu_search',
    //         language: '英语',
    //         flash: '',
    //         summary: '20世纪40年代末，小有成就的青年银行家安迪（蒂姆·罗宾斯 Tim Robbins 饰）因涉嫌杀害妻子及她的情人而锒铛入狱。在这座名为肖申克的监狱内，希望似乎虚无缥缈，终身监禁的惩罚无疑注定了安迪接下来灰暗绝望的人生。未过多久，安迪尝试接近囚犯中颇有声望的瑞德（摩根·弗里曼 Morgan Freeman 饰），请求对方帮自己搞来小锤子。以此为契机，二人逐渐熟稔，安迪也仿佛在鱼龙混杂、罪恶横生、黑白混淆的牢狱中找到属于自己的求生之道。他利用自身的专业知识，帮助监狱管理层逃税、洗黑钱，同时凭借与瑞德的交往在犯人中间也渐渐受到礼遇。表面看来，他已如瑞德那样对那堵高墙从憎恨转变为处之泰然，但是对自由的渴望仍促使他朝着心中的希望和目标前进。而关于其罪行的真相，似乎更使这一切朝前推进了一步…… '
    //     }
    // })

    let id = req.params.id;
    Movie.findById(id, function(err, movie) {
        res.render("detail", {
            title: "电影: " + movie.title,
            movie: movie
        })
    });
});

/* 
 * 后台录入页
 */
app.get("/admin/movie", function(req, res) {
    res.render("admin", {
        title: "Hello admin",
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
});

/* 
 * 更新电影
 * 在列表页点更新，重新回到后台录入页，需将电影的数据初始化到表单中
 * app.use官网的解释为：Mounts the middleware function(s) at the path. If path is not specified, it defaults to “/”.
 * 我的理解为：在指定的路径中载入这个中间件方法，与get方法的区别为，use是通用的，get是指定了的特定路径或路径规则的
 */
app.use("/admin/update/:id", function(req, res) {
    let id = req.params.id;

    if (id) {
        Movie.findById(id, function(err, movie) {
            if (err) { console.log(err); }

            res.render("admin", {
                title: "后台更新页：" + movie.title,
                movie: movie
            })
        })
    }
})

/* 
 * 后台录入post过来的数据
 * app.use官网的解释：Routes HTTP DELETE requests to the specified path with the specified callback functions
 * 我的理解是对指定的路径发送一个HTTP DELETE请求，并执行指定的回调方法
 */
app.use("/admin/movie/new", function(req, res) {
    let id = req.body.movie._id;
    let movieObj = req.body.movie;
    let _movie;

    if (id !== "undefined") {
        // 电影是已存储状态
        Movie.findById(id, function(err, movie) {

            if (err) { console.log(err) }
            // 用post过来的新数据movieObj去更新 现有查询到的movie对应的字段数据
            _movie = _.extend(movie, movieObj);
            // 将更新后的数据进行存储
            _movie.save(function(err, movie) {
                if (err) { console.log(err) }

                res.redirect("/movie/" + movie.id);
            })
        })
    } else {
        // 电影是新添加状态
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            summary: movieObj.summary,
            flash: movieObj.flash,
            poster: movieObj.poster,
            year: movieObj.year
        });
        _movie.save(function(err, movie) {
            if (err) { console.log(err) }

            res.redirect("/movie/" + movie.id);
        })
    }
});

/* 
 * 列表页
 */
app.get("/admin/list", function(req, res) {
    // res.render("list", {
    //     title: "Hello list",
    //     movies: [{
    //         _id: 1,
    //         doctor: '弗兰克·德拉邦特',
    //         country: '美国',
    //         title: '肖申克的救赎',
    //         year: 1994,
    //         poster: 'https://movie.douban.com/subject/1292052/?referer=baidu_search',
    //         language: '英语',
    //         flash: '',
    //         summary: '20世纪40年代末，小有成就的青年银行家安迪（蒂姆·罗宾斯 Tim Robbins 饰）因涉嫌杀害妻子及她的情人而锒铛入狱。在这座名为肖申克的监狱内，希望似乎虚无缥缈，终身监禁的惩罚无疑注定了安迪接下来灰暗绝望的人生。未过多久，安迪尝试接近囚犯中颇有声望的瑞德（摩根·弗里曼 Morgan Freeman 饰），请求对方帮自己搞来小锤子。以此为契机，二人逐渐熟稔，安迪也仿佛在鱼龙混杂、罪恶横生、黑白混淆的牢狱中找到属于自己的求生之道。他利用自身的专业知识，帮助监狱管理层逃税、洗黑钱，同时凭借与瑞德的交往在犯人中间也渐渐受到礼遇。表面看来，他已如瑞德那样对那堵高墙从憎恨转变为处之泰然，但是对自由的渴望仍促使他朝着心中的希望和目标前进。而关于其罪行的真相，似乎更使这一切朝前推进了一步…… '

    //     }]
    // })

    Movie.fetch(function(err, movies) {
        if (err) { console.log(err) }

        res.render("list", {
            title: "电影列表",
            movies: movies
        })
    })
});

/* 
 * 删除操作
 */
app.delete("/admin/list", function(req, res) {
    let id = req.query.id;

    if (id) {
        Movie.remove({ _id: id }, function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({ success: 1 });
            }
        });
    }
})

// 启动后打印日志
console.log("strted on port " + port);