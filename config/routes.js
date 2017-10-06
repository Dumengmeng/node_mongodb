const Index = require("../app/controllers/index");
const Movie = require("../app/controllers/movie");
const User = require("../app/controllers/user");
const Comment = require("../app/controllers/comment");

module.exports = function(app) {

    /* 
     * pre handle user
     */
    app.use(function(req, res, next) {
        let _user = req.session.user;
        // 每次刷新页面，将session里边的user取出，放到本地变量里边，从而能够render到页面上去
        app.locals.user = _user;
        return next()
    })

    app.get("/", Index.index)

    // User
    app.post("/user/signup", User.signup)
    app.post("/user/signin", User.signin)
    app.get("/logout", User.logout)
    app.get("/signin", User.showSignin)
    app.get("/signup", User.showSignup)
    app.get("/admin/user/list", User.signinRequired, User.adminRequired, User.list)

    // Movie
    app.get("/movie/:id", Movie.detail)
    app.get("/admin/movie/new", User.signinRequired, User.adminRequired, Movie.new)
    app.get("/admin/movie/update/:id", User.signinRequired, User.adminRequired, Movie.update)
    app.post("/admin/movie", User.signinRequired, User.adminRequired, Movie.save)
    app.get("/admin/movie/list", User.signinRequired, User.adminRequired, Movie.list)
    app.delete("/admin/movie/list", User.signinRequired, User.adminRequired, Movie.del)

    // Comment
    app.post("/user/comment", User.signinRequired, Comment.save)
}