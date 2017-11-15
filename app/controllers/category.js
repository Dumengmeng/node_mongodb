const Category = require('../models/category')
exports.new = function(req, res) {
    res.render('categoryAdmin', {
        title: 'imovie的后台分类录入页',
        category: {}
    })
}

exports.save = function(req, res) {
    const _category = req.body.category

    const category = new Category(_category)

    category.save(function(err, category) {
        if (err) console.log(err)

        res.redirect('/admin/category/list')
    })
}

exports.list = function(req, res) {
    Category.fetch(function(err, categories) {
        if (err) console.log(err)

        res.render('categoryList', {
            title: 'movies分类列表页',
            categories: categories
        })
    })
}