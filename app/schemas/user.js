/* 
 * 定义模式
 */
const mongoose = require("mongoose")
    // const bcrypt = require('bcrypt') // 跨平台文件加密工具
const SALT_WORK_FACTOR = 10

let UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    /* 
     * 用户角色规则：
     * 0、normal user
     * 1、verify user
     * 2、primary user
     * >10、admin
     * >50、super admin
     */
    role: {
        type: Number,
        default: 0
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


UserSchema.pre('save', function(next) {
    let user = this
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    // 生成盐
    // bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    //     if (err) { return next(err) }

    //     // 添加盐
    //     bcrypt.hash(user.password, salt, function(error, hash) {
    //         if (error) { return next(error) }
    //         user.password = hash
    //         next()
    //     })
    // })
    next()
})

UserSchema.methods = {
    comparePassword: function(_password, cb) {
        // bscrypt.compare(_password, this.password, function(err, isMatch) {
        //     if (err) { return cb(err) }

        //     cb(null, isMatch)
        // })
        if (_password === this.password) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
}

UserSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
}

module.exports = UserSchema;