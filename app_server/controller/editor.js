module.exports.uploads = function(req, res) {
    console.log(req.headers, req.body, req.file);
    res.json({ url: '/images/uploads/' + req.file.filename, uploaded: true });
}