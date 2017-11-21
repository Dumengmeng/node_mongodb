//路由
/* 
 * 首页
 */
const Category = require("../models/category")

exports.index = function(req, res) {
    // 2、渲染数据库的实际数据
    Category
        .find({})
        .populate({ path: 'movies', options: { limit: 5 } })
        .exec(function(err, categories) {
            if (err) { console.log(err); }

            res.render("index", {
                title: "首页",
                categories: categories
            })
        })
}

// search page
exports.search = function(req, res) {
    var catId = req.query.cat
    var page = parseInt(req.query.p, 10)
    var count = 2
    var index = page * count;

    Category
        .find({ _id: catId })
        .populate({
            path: 'movies',
            select: 'title poster',
        })
        .exec(function(err, categories) {
            if (err) {
                console.log(err)
            }
            var category = categories[0] || {}
            var movies = category.movies || []
            var results = movies.slice(index, index + count)
            console.log('---------------------')
            console.log(movies)
            res.render('results', {
                title: '搜索结果页',
                keyword: category.name,
                currentPage: page + 1,
                totalPage: Math.ceil(movies.length / count),
                catId: catId,
                movies: results
            })
        })

}