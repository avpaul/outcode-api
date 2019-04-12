import express from 'express';
import adminViewsController from '../../controllers/views/admin';
import adminPostsController from '../../controllers/views/adminPost';

const router = express.Router();

router.get('/login', adminViewsController.login);
router.get('/metrics', adminViewsController.metrics);
router.get('/media', adminViewsController.media);
router.get('/comments', adminViewsController.comments);
router.get('/posts', adminPostsController.getPosts);
router.get('/posts/new', adminPostsController.getNew);
router.get('/posts/update', adminPostsController.getUpdate);

export default router;
