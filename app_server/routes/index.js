import express from 'express';

import gen from '../controllers/general';
import blog from '../controllers/blog';
import comment from '../controllers/comments';

const router = express.Router();

// home
router.get('/', gen.home);

// blog / articles
router.get('/blog', blog.getAll);
router.get('/blog/:title', blog.getOne);
router.get('/blog?category', blog.getCategory);
router.get('/blog?tag', blog.getTag);

// comment
router.get('/comments', comment.get);
router.post('/comments/new', comment.new);
router.post('/comments/update', comment.update);
router.post('/comments/reply', comment.reply);
router.delete('/comments/delete', comment.delete);

// others
router.get('/projects', gen.projects);
router.get('/resources', gen.resource);
router.get('/about', gen.about);
router.get('/about#work', gen.about);
router.get('/about#contact', gen.about);

export default router;
