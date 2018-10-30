var Post = require('mongoose').model('Post');
var Boom = require('boom');

module.exports.get = function(req, res, next) {

}
module.exports.new = function(req, res, next) {
    var pid = req.body.id;
    var comment = JSON.parse(req.body.comment);
    if (!pid) {
        next(Boom.badRequest('post id not found'));
    } else if (!comment) {
        next(Boom.badRequest('comment not found'));
    }
    if (!Number.isInteger(pid)) {
        pid = Number(pid);
    }

    Post.findOne({ id: pid }, ['comments']).then(p => {
        p.comments.push({
            author: comment.name,
            content: comment.content,
            publicationDate: new Date(Date.now())
        });
        p.save();
        res.status(200);
        res.json({ saved: true })
    }).catch((err) => {
        console.log(err);
        next(Boom.boomify(err));
    });
}
module.exports.update = function(req, res, next) {

}
module.exports.reply = function(req, res, next) {

}
module.exports.delete = function(req, res, next) {

}