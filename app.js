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
var Boom = require('boom');
require('./app_server/model/db');
require('./app_server/config/passport');


//WEBPACK HRM
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.babel.js')('dev');
var compiler = webpack(webpackConfig);


var indexRoutes = require('./app_server/routes/index');
var adminRoutes = require('./app_server/routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

if (process.env.mode === 'prod') {
    // ADD BROWSER-SYNC AS A MIDDLEWARE
    if (true) {
        var browserSync = require('browser-sync');
        var bs = browserSync.create().init({
            logSnippet: false,
            online: false,
            files: ['./app_server/routes', './app_server/controller', './app_api'],
            logConnections: true,
            tunnel: true,
            ghostMode: {
                clicks: true,
                forms: true,
                scroll: true
            },
            browser: 'google chrome',
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
app.use(passport.initialize());


app.use('/', indexRoutes);
app.use('/admin', adminRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(Boom.notFound('That one was not found!'));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    if (Boom.isBoom(err)) {
        res.status(err.output.statusCode || 500).render('error', { error: err.output.payload });
    } else if (err.status === 500) {
        console.log(err);
    } else {
        res.status(err.status || 500).render('error', {
            error: {
                statusCode: err.status,
                message: err.message
            }
        });
    }
});

module.exports = app;