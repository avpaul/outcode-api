import express from 'express';
import articleValidator from '../middleware/validation/articleValidation';
import authMiddleware from '../middleware/authenticate';
import articleController from '../controllers/articleController';

const router = express.Router();

router.get('/articles', articleController.getArticles);
router.get('/articles/published', authMiddleware, articleController.getPublished);
router.get('/articles/drafts', authMiddleware, articleController.getDrafts);

router.get(
  '/articles/:slug',
  articleValidator.slug,
  articleValidator.slug,
  articleController.getArticle
);
router.post(
  '/articles',
  authMiddleware,
  articleValidator.createOrUpdate,
  articleController.createArticle
);
router.put(
  '/articles/:slug',
  authMiddleware,
  articleValidator.slug,
  articleValidator.createOrUpdate,
  articleController.updateArticle
);
router.delete(
  '/articles/:slug',
  authMiddleware,
  articleValidator.slug,
  articleController.deleteArticle
);

export default router;
