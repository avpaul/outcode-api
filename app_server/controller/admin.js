var request = require('request');

//The controller or path should be posts/editor then as a querry string new or update or review... 
module.exports.newPostCtrl = function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.render('./admin/newpost', { title: 'New post' })
}
module.exports.postsCtrl = function(req, res, next) {
    res.render('./admin/posts', { title: '' })

}
module.exports.mediaCtrl = function(req, res, next) {
    res.render('./admin/media', { title: '' })

}
module.exports.metricsCtrl = function(req, res, next) {

    res.render('./admin/metrics', { title: '' })
}
module.exports.commentsCtrl = function(req, res, next) {
    res.render('./admin/comments', { title: '' })

}
module.exports.loginCtrl = function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.render('./admin/login', { title: 'Login' })
}
module.exports.signupCtrl = function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    res.render('./admin/signup', { title: 'Create Account' })
}

module.exports.signup = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) {
        if (!email && !password) {
            res.render('./admin/signup', {
                title: 'Signup',
                message: 'email and password not found!'
            });
        } else if (!email) {
            res.render('./admin/signup', {
                title: 'Signup',
                message: 'email not found!'
            });
        } else {
            res.render('./admin/signup', {
                title: 'Signup',
                message: 'password not found!'
            });
        }
    }

    request('http://localhost:3030/users/create', { method: 'POST', json: req.body, qs: {} }, function(err, result) {
        if (err) {
            res.render('./admin/signup', {
                title: 'Signup',
                message: err
            });
        } else {
            if (result.statusCode === 200) {
                res.redirect('/admin/article');
            } else {
                var message = '';
                console.log(result.body);
                if (result.body.message.code === 11000) {
                    message = email + ' is arleady registered!'
                }
                res.render('./admin/signup', {
                    title: 'Signup',
                    message: message
                });
            }
        }
    })

}


module.exports.login = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) {
        if (!email && !password) {
            res.render('./admin/signup', {
                title: 'Signup',
                message: 'email and password not found!'
            });
        } else if (!email) {
            res.render('./admin/signup', {
                title: 'Signup',
                message: 'email not found!'
            });
        } else {
            res.render('./admin/signup', {
                title: 'Signup',
                message: 'password not found!'
            });
        }
    }

    request('http://localhost:3000/users/login', { method: 'POST', json: req.body, qs: {} }, function(err, result) {
        if (err) {
            res.render('./admin/login', {
                title: 'Sigin',
                message: err
            });
        } else {
            if (result.statusCode === 200) {
                res.redirect('/admin/article');
            } else {
                res.render('./admin/login', {
                    title: 'Login',
                    message: 'Password incorect'
                });
            }
        }
    })
}