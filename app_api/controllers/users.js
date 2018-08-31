var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

module.exports.createUser = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
        jsonResponse(res, '400', 'email or password missing!')
    } else {
        var user = new User();
        user.email = email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.setPassword(password);
        user.save(function(err) {
            if (err) {
                if (err.code === 11000) {
                    res.status(400);
                    res.json({ message: 'User with email ' + email + ' exists' });
                } else {
                    var message = {
                        code: err.code,
                        message: err.errmsg
                    }
                    jsonResponse(res, 400, message);
                }
            } else {
                var token = user.generateJWT();
                res.status(200);
                res.json({
                    token: token,
                    _id: user._id
                });
            }
        })

    }
}
module.exports.readUser = function(req, res, next) {

}

module.exports.deleteUser = function(req, res, next) {

}
module.exports.updateUser = function(req, res, next) {

}
module.exports.loginUser = function(req, res, next) {
    var password = req.body.password;
    var email = req.body.email;
    if (!email || !password) {
        jsonResponse(res, 400, { message: "password or email missing" });
    }
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            jsonResponse(res, 400, err.errmsg);
            return;
        }

        if (user) {
            var token = user.generateJWT();
            res.setHeader('authorization', 'Bearer ' + token);
            req.headers.authorization = 'Bearer ' + token;
            res.status(200);
            res.json({
                token: token,
                _id: user._id
            });

        } else {
            jsonResponse(res, 400, info);
        }
    })(req, res);

}
module.exports.logoutUser = function(req, res, next) {

}

function jsonResponse(res, status, json) {
    res.status(status);
    res.json(json);
}