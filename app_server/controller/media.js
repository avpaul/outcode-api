module.exports.get = function(req, res, nextrams) {
    res.render('./admin/media', { title: '' })

}
module.exports.upload = function(req, res, next) {
    res.status(200);
    res.json({ url: '/images/uploads/' + req.file.filename, uploaded: true });
}
module.exports.update = function(req, res, nextrams) {

}
module.exports.delete = function(req, res, nextrams) {

}