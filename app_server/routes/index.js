var express = require('express');
var router = express.Router();
var blogCtrl = require('../controller/blog');
var admnCtrl = require('../controller/admin');
var editorCtrl = require('../controller/editor');


var ejwt = require('express-jwt');
var auth = ejwt({
    secret: 'iamtheoneandonly',
    userProperty: 'payload'
});

router.get('/', blogCtrl.homeCtrl);
router.get('/home', blogCtrl.homeCtrl);
router.get('/article', blogCtrl.articleCtrl)
router.get('/demos', blogCtrl.demoCtrl);
router.get('/ressources', blogCtrl.resCtrl);
// router.get('/about', blogCtrl.aboutCtrl);
router.get('/about', blogCtrl.about);

// ADMIN
router.get('/admin', admnCtrl.loginCtrl);
router.get('/admin/signup', admnCtrl.signupCtrl);
router.get('/admin/posts', admnCtrl.postsCtrl);
router.get('/admin/posts/new', admnCtrl.newPostCtrl);
router.get('/admin/media', admnCtrl.mediaCtrl);
router.get('/admin/metrics', admnCtrl.metricsCtrl);
router.get('/admin/comments', admnCtrl.commentsCtrl);

// handle post methods here
router.post('/admin', admnCtrl.login);
router.post('/admin/signup', admnCtrl.signup);

// Editor
// router.post('/uploads/editor', upload.single('upload'), editorCtrl.uploads);
router.post('/uploads/editor', editorCtrl.uploads);

module.exports = router;