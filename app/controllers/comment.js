/* 
 * 详情页
 */
const Comment = require("../models/comment")
const _ = require("underscore");

exports.save = function(req, res) {
    let _comment = req.body.comment
    let movieId = _comment.movie

    let comment = new Comment(_comment);

    comment.save(function(err, movie) {
        if (err) { console.log(err) }

        res.redirect("/movie/" + movieId);
    })
}