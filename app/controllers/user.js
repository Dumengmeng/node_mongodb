/* 
 *注册
 */
const User = require("../models/user");

exports.showSignin = function(req, res) {
    res.render("signin", {
        title: "登录页面"
    })
}

exports.showSignup = function(req, res) {
    res.render("signup", {
        title: "注册页面"
    })
}

exports.signup = function(req, res) {
    let _user = req.body.user

    // 查看数据库是否已经存在该用户
    User.find({ name: _user.name }, function(err, user) {
        if (err) { console.log(err) }

        if (user) {
            res.redirect("/signin")
        } else {
            let user = new User(_user)
            user.save(function(err, user) {
                if (err) { console.log(err) }

                res.redirect('/admin/userlist')
            })
        }
    })
}

/* 
 * 登录
 */
exports.signin = function(req, res) {
    let _user = req.body.user
    let name = _user.name
    let password = _user.password

    User.findOne({ name: name }, function(err, user) {
        if (err) { console.log(err) }

        if (!user) { return res.redirect("/signup") }

        user.comparePassword(password, function(err, isMatch) {
            if (err) { console.log(err) }

            if (isMatch) {
                req.session.user = user
                console.log("login success!")
                return res.redirect("/")
            } else {
                return res.redirect("/signin")
            }
        })
    })
}

/* 
 * 登出
 */
exports.logout = function(req, res) {
    delete req.session.user
        // delete app.locals.user
    res.redirect("/")
}

/* 
 * user list
 */
exports.list = function(req, res) {
    User.fetch(function(err, users) {
        if (err) { console.log(err) }

        res.render("userlist", {
            title: "用户列表",
            users: users
        })
    })
}

/* 
 * middleware for user
 */
exports.signinRequired = function(req, res, next) {
    let user = req.session.user

    if (!user) {
        return res.redirect("/signin")
    }

    next()
}

exports.adminRequired = function(req, res, next) {
    let user = req.session.user

    if (user.role <= 0) {
        return res.redirect("/signin")
    }

    next()
}