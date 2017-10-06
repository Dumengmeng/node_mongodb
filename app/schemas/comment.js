/* 
 * 定义模式
 */
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

let CommentSchema = new Schema({
    movie: {
        type: ObjectId,
        ref: "Movie"
    },
    from: {
        type: ObjectId,
        ref: "User"
    },
    to: {
        type: ObjectId,
        ref: "User"
    },
    content: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

module.exports = CommentSchema;