var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var Boom = require('boom');

module.exports.createUser = async function(d, done, next) {
    var email = d.email;
    var password = d.password;

    if (!email || !password) {
        next(Boom.badRequest('email or/and password not found'));
    } else {
        var user = new User();
        user.email = email;
        user.setPassword(password);
        await user.save(function(err) {
            if (err) {
                if (err.code === 11000) {
                    next(Boom.badRequest(`User with email ${email} already exists`));
                } else {
                    next(Boom.boomify(err));
                }
            } else {
                var token = user.generateJWT();
                done(token, user._id);
            }
        })

    }
}

module.exports.loginUser = function(d, done, req, res, next) {
    var password = d.password;
    var email = d.email;
    if (!email || !password) {
        next(Boom.badRequest('email and/or password not found'));
    }
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            next(Boom.boomify(err));
            return;
        }

        if (user) {
            var token = user.generateJWT();
            done(token, user._id);

        } else {
            next(info)
        }
    })(req, res);

}