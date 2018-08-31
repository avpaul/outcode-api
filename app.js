// 'use strict';

//NODE ENV
process.env.mode = 'dev';

//EXPRESS IMPORTS
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
require('./app_api/model/db');
require('./app_api/config/passport');

//WEBPACK HRM
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.babel.js')('dev');
var compiler = webpack(webpackConfig);


var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_api/routes/users');
var apiRouter = require('./app_api/routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

if (process.env.mode === 'dev') {
    // ADD BROWSER-SYNC AS A MIDDLEWARE
    if (true) {
        var browserSync = require('browser-sync');
        var bs = browserSync.create().init({
            logSnippet: false,
            online: false,
            files: ['./app_server/routes', './app_server/controller', './app_api'],
            logConnections: true,
            tunnel: true,
            plugins: [{
                module: "bs-html-injector",
                options: {
                    files: ['./app_server/views/blog/**.pug', './app_server/views/admin/**.pug']
                }
            }]
        });
        app.use(require('connect-browser-sync')(bs, { injectHead: true }));
    }

    // ADD WEBPACK DEV && HOT MIDDLEWARE
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,

    }));
    app.use(require('webpack-hot-middleware')(compiler, { reload: true }));
}

// INITIALIZE PASSPORT
// app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/json', (req, res) => {
    res.redirect('http://localhost:3001/' + req.originalUrl);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // res.redirect('/admin');
        res.status(401);
        res.json({ "message": err.name + ": " + err.message });
    }
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;