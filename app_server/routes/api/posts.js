import express from 'express';
import post from '../../controllers/api/posts';
import createPost from '../../controllers/api/posts/createpost';
import updatePost from '../../controllers/api/posts/updatepost';

const router = express.Router();

// post
router.post('/new', createPost);
router.post('/update', updatePost);
router.post('/publish', post.publish);
router.post('/archive', post.hide);
// delete
router.delete('/delete', post.delete);

export default router;
