//路由
/* 
 * 首页
 */
const Movie = require("../models/movie")

exports.index = function(req, res) {
    console.log("user in session: ")
    console.log(req.session.user)
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
}