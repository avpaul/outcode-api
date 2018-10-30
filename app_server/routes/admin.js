var router = require('express').Router();

// CONTROLLERS
var admin = require('../controller/admin');
var post = require('../controller/posts');
var user = require('../controller/user');
var media = require('../controller/media');

// JSON WEB TOKEN/ ATHORIZATION 
// Modify ejwt getToken function to use cookies also
var ejwt = require('express-jwt');
var auth = ejwt({
    secret: 'iamtheoneandonly',
    userProperty: 'payload',
    getToken: function fromHeaderOrCookie(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        } else if (req.cookies && req.cookies.id_token) {
            return req.cookies.id_token;
        }
        return null;
    }
});

// Express Multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'dist/images/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null,
            file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]
        )
    }
});

var upload = multer({
    storage: storage
});

// ADMIN user
router.get('/login', user.get);
router.post('/login', user.auth);
router.post('/signup', user.create);

// ADMIN POSTS/EDITOR 
// GET
router.get('/posts', auth, post.get);
router.get('/posts/new', auth, post.getNew);
router.get('/posts/update', auth, post.getUpdate);
router.get('/posts/update/oldversion', auth, post.getOldversion);
router.get('/posts/preview/:title', auth, post.preview);
// POST
router.post('/posts/new', auth, post.new);
router.post('/posts/update', auth, post.update);
router.post('/posts/publish', auth, post.publish);
router.post('/posts/archive', auth, post.hide);
// DELETE
router.delete('/posts/delete', auth, post.delete);

// MEDIA
router.get('/media', auth, media.get);
router.post('/media/upload', auth, upload.single('upload'), media.upload);
router.post('/media/update', auth, upload.single('upload'), media.upload);
router.delete('/media/delete', auth, upload.single('upload'), media.delete);

// METRICS & COMMENTS
router.get('/metrics', auth, admin.metrics);
router.get('/comments', auth, admin.comments);

module.exports = router;