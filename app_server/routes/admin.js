import express from 'express';
import multer from 'multer';
// controllers
import ejwt from 'express-jwt';
import admin from '../controllers/admin';
import post from '../controllers/posts';
import user from '../controllers/user';
import media from '../controllers/media';

const router = express.Router();
// JSON WEB TOKEN/ authorization
// Modify ejwt getToken function to use cookies also

const auth = ejwt({
  secret: 'iamtheoneandonly',
  userProperty: 'payload',
  getToken: function fromHeaderOrCookie(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } if (req.query && req.query.token) {
      return req.query.token;
    } if (req.cookies && req.cookies.id_token) {
      return req.cookies.id_token;
    }
    return null;
  },
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'dist/images/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null,
      `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
  },
});

const upload = multer({
  storage,
});

// admin/user
router.get('/login', user.get);
router.post('/login', user.auth);
router.post('/signup', user.create);

// admin/editor
// get
router.get('/posts', auth, post.get);
router.get('/posts/new', auth, post.getNew);
router.get('/posts/update', auth, post.getUpdate);
router.get('/posts/update/oldversion', auth, post.getOldVersion);
router.get('/posts/preview/:title', auth, post.preview);
// post
router.post('/posts/new', auth, post.new);
router.post('/posts/update', auth, post.update);
router.post('/posts/publish', auth, post.publish);
router.post('/posts/archive', auth, post.hide);
// delete
router.delete('/posts/delete', auth, post.delete);

// media
router.get('/media', auth, media.get);
router.post('/media/upload', auth, upload.single('upload'), media.upload);
router.post('/media/update', auth, upload.single('upload'), media.upload);
router.delete('/media/delete', auth, upload.single('upload'), media.delete);

// metrics & comments
router.get('/metrics', auth, admin.metrics);
router.get('/comments', auth, admin.comments);

export default router;
