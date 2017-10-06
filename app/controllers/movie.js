/* 
 * 详情页
 */
const Movie = require("../models/movie")
const Comment = require("../models/comment")
const _ = require("underscore");

exports.detail = function(req, res) {
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
        Comment
        // 找到所有对该电影的评论
            .find({ movie: id })
            // 插入相关联的文档
            // from为要插入的文档
            // name为要关联的字段
            // 根据from里边的ObjectId字段，去表(user)里边查询name字段，并填充到from里边
            .populate("from", "name")
            .exec(function(err, comments) {
                res.render("detail", {
                    title: "电影: " + movie.title,
                    movie: movie,
                    comments: comments
                })
            })
    });
};

/* 
 * 后台录入页
 */
exports.new = function(req, res) {
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
};

/* 
 * 更新电影
 * 在列表页点更新，重新回到后台录入页，需将电影的数据初始化到表单中
 * app.use官网的解释为：Mounts the middleware function(s) at the path. If path is not specified, it defaults to “/”.
 * 我的理解为：在指定的路径中载入这个中间件方法，与get方法的区别为，use是通用的，get是指定了的特定路径或路径规则的
 */
exports.update = function(req, res) {
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
};

/* 
 * 后台录入post过来的数据
 * app.use官网的解释：Routes HTTP DELETE requests to the specified path with the specified callback functions
 * 我的理解是对指定的路径发送一个HTTP DELETE请求，并执行指定的回调方法
 */
exports.save = function(req, res) {
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
};

/* 
 * 列表页
 */
exports.list = function(req, res) {
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
};

/* 
 * 删除操作
 */
exports.del = function(req, res) {
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
};