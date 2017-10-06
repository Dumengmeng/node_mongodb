/* 
 * 定义模式
 */
const mongoose = require("mongoose");

let MovieSchema = new mongoose.Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: String,
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