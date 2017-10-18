/* 
 * 详情页
 */
const Comment = require("../models/comment")
const _ = require("underscore");

exports.save = function(req, res) {
    let _comment = req.body.comment
    let movieId = _comment.movie
    let comment = new Comment(_comment);

    if (_comment.cid) {
        Comment.findById(_comment.cid, function(err, comment) {
            let replay = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            }

            comment.replay.push(replay)

            comment.save(function(err, comment) {
                if (err) { console.log(err) }

                res.redirect('/movie/', movieId)
            })
        })
    } else {
        comment.save(function(err, movie) {
            if (err) { console.log(err) }

            res.redirect("/movie/" + movieId);
        })
    }
}