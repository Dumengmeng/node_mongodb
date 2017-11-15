/* 
 * 定义模式
 */
const mongoose = require("mongoose")
const Schema = mongoose.Schema

let MovieSchema = new Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: String,
    // 可以使用String或者ObjectId，推荐使用ObjectId是因为，这样可以建立一个双向的映射，查到当前电影数据的同时，
    // 也能得到该电影对应的category的name、或者id等数据，若使用string，则必须进行二次查询，通过category的name，
    // 找到该category对应的id，进而查找其他对应的数据，这样一来就比较麻烦
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
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

/*
 * Defines a pre hook for the document.
 * 给文档定义一个pre hook
 * 这个中间件方法会在‘save’之前被执行，若要定义被‘save’之后执行的方法，可用‘post’方法
 * https://github.com/bnoguchi/hooks-js/tree/31ec571cef0332e21121ee7157e0cf9728572cc3
 */
MovieSchema.pre("save", function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    // 将控制权交给下一个中间件或者它自己的目标函数
    next();
})

/* 
 * Adds static "class" methods to Models compiled from this schema.
 * 添加静态方法，使得Models从模式里边编译
 * 添加一条静态方法可用static方法:
 * schems.static("[methodName]", fn)
 */
MovieSchema.statics = {
    // 取出目前数据库中的所有数据
    fetch: function(cb) {
        return this
            .find({})
            .sort("meta.updateAt")
            .exec(cb)
    },
    // 根据ID查询数据
    findById: function(id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb)
    }
}

module.exports = MovieSchema;