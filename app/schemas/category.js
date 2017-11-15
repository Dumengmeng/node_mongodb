const mongoose = require('mongoose')
const Schema = mongoose.Schema

// The various built-in Mongoose Schema Types. (Schema 内置了几种不同的类型)
// eg. String Number Boolean Array Buffer Date ObjectId Mixed
// ObjectId类型构造器
// MongoDB是文档性数据库，没有关联性数据库join的特性，所以他封装了Population功能，以此来实现在一个document中填充另外一个document
const ObjectId = Schema.Types.ObjectId

const CategorySchema = new Schema({
    name: String, // 类型的名称
    movies: [{ // 属于该类型的所有电影
        type: ObjectId, // 该类型必须为ObjectId、Number、String、Buffer时，ref属性才有效
        ref: 'Movie' // 表示关联到了Movie Schema
    }],
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
})

CategorySchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.create = this.meta.updateAt = Date.now()
    } else {
        this.updateAt = Date.now()
    }
    next()
})

CategorySchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb)
    }
}

module.exports = CategorySchema;