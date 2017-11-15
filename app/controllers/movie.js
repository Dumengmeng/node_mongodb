/* 
 * 详情页
 */
const Movie = require("../models/movie")
const Category = require("../models/category")
const Comment = require("../models/comment")
const _ = require("underscore");

exports.detail = function(req, res) {
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
            .populate("replay.from replay.to", "name")
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
    Category.find({}, function(err, categories) {
        if (err) console.log(err)

        res.render("admin", {
            title: "Hello admin",
            categories: categories,
            movie: {}
        })
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

            Category.find({}, function(err2, categories) {
                if (err2) { console.log(err2); }

                res.render("admin", {
                    title: "后台更新页：" + movie.title,
                    movie: movie,
                    categories: categories
                })
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
    console.log('save')
    if (id) {
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
        _movie = new Movie(movieObj);

        const categoryId = movieObj.category;
        const categoryName = movieObj.categoryName;

        _movie.save(function(err, movie) {
            if (err) { console.log(err) }

            if (categoryId) {
                Category.findById(categoryId, function(err, category) {
                    category.movies.push(movie._id)

                    category.save(function(err, category) {
                        res.redirect("/movie/" + movie._id);
                    })
                })
            } else if (categoryName) {
                let category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                })

                category.save(function(err, category) {
                    movie.category = category._id
                    movie.save(function(err, movie) {
                        res.redirect("/movie/" + movie._id);
                    })
                })
            }
        })
    }
};

/* 
 * 列表页
 */
exports.list = function(req, res) {
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