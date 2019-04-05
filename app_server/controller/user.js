var Boom = require('boom');
var User = require('../backend/users');

module.exports.get = function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.render('./admin/login', { title: 'Login' })
}

module.exports.create = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) {
        if (!email && !password) {
            next(Boom.badRequest('email and password not found'));
        } else if (!email) {
            next(Boom.badRequest('email not found'));
        } else {
            next(Boom.badRequest('password not found'));
        }
    }

    var done = function(token, id) {-
        res.status(200);
        res.json({ token: token, id: id })
    }
    User.createUser({ email: email, password: password }, done, next);
}


module.exports.auth = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) {
        if (!email && !password) {
            next(Boom.badRequest('email and password not found'));
        } else if (!email) {
            next(Boom.badRequest('email not found'));
        } else {
            next(Boom.badRequest('password not found'));
        }
    }
    var done = function(token, id) {
        res.setHeader('Set-Cookie', 'id_token=' + token + ';path=/;expires=' + new Date(Date.now() + 60480000).toUTCString() + ';sameSite=true');
        res.status(200);
        res.json({ id: id, token: token });
    }
    User.loginUser({ email: email, password: password }, done, req, res, next);
}
