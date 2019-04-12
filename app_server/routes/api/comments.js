import express from 'express';
import commentsController from '../../controllers/api/comments';

const router = express.Router();

router.post('/comments/new', commentsController.new);
router.post('/comments/update', commentsController.update);
router.post('/comments/reply', commentsController.reply);
router.delete('/comments/delete', commentsController.delete);

export default router;
