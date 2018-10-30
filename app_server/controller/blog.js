var post = require('../backend/post');

module.exports.getAll = function(req, res, next) {

};

module.exports.getOne = function(req, res, next) {
    var id = req.query.id;
    post.getOnePost({ id: id }, next, (r) => {
        post.getNPost({ id: { $ne: id } }, 2, next, (r2) => {
            res.cookie('bpid', r.id);
            res.setHeader("Content-Type", "text/html");
            res.render("./blog/blog", {
                title: r.title,
                post: r,
                next: r2
            });
        })
    });

}
module.exports.getCategory = function(req, res, next) {

}
module.exports.getTag = function(req, res, next) {

}