import express from 'express';
import blog from '../../controllers/views/blog';
import adminViewsRouter from './admin';

const router = express.Router();

router.use('/admin', adminViewsRouter);
// home
router.get('/', blog.getHome);

// blog / articles
// router.get('/blog', blog.g);
router.get('/blog/:title', blog.getOne);
router.get('/blog?category', blog.getCategory);
router.get('/blog?tag', blog.getTag);

// others

router.get('/projects', blog.projects);
router.get('/resources', blog.resource);
router.get('/about', blog.about);
router.get('/about#work', blog.about);
router.get('/about#contact', blog.about);

export default router;
