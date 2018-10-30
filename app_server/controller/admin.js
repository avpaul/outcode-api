module.exports.metrics = function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200);
    res.render('./admin/metrics', { title: 'AvPaul blog metrics' })
}
module.exports.comments = function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.render('./admin/comments', { title: '' })
}