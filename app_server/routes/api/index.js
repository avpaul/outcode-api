import express from 'express';
import mediaRouter from './media';
import postsRouter from './posts';
import commentRouter from './comments';

const router = express.Router();

router.use('/posts', postsRouter);
router.use('/comments', commentRouter);
router.use('/media', mediaRouter);

export default router;
