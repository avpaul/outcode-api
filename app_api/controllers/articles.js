var mongoose = require('mongoose');
var Article = mongoose.model('Article');

module.exports.readArticle = function(req, res, next) {

}
module.exports.createArticle = function(req, res, next) {
    console.log('create article');
    Article.create({
        title: 'The fast lane : a story of a selfmade billionaire',
        author: 'av paul',
        state: 'published',
        category: 'technology',
    })
}
module.exports.updateArticle = function(req, res, next) {

}
module.exports.deleteArticle = function(req, res, next) {

}

// article comments

module.exports.readComment = function(req, res, next) {

}
module.exports.addComment = function(req, res, next) {

}
module.exports.updateComment = function(req, res, next) {

}
module.exports.deleteComment = function(req, res, next) {

}