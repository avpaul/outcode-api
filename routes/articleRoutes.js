import express from 'express';
import articleValidator from '../middleware/validation/articleValidation';
import articleController from '../controllers/articleController';

const router = express.Router();

router.get('/articles', articleController.getArticles);
router.get('/articles/published', articleController.getPublished);
router.get('/articles/drafts', articleController.getDrafts);

router.get(
  '/articles/:slug',
  articleValidator.slug,
  articleValidator.slug,
  articleController.getArticle
);
router.post('/articles', articleValidator.createOrUpdate, articleController.createArticle);
router.put(
  '/articles/:slug',
  articleValidator.slug,
  articleValidator.createOrUpdate,
  articleController.updateArticle
);
router.delete('/articles/:slug', articleValidator.slug, articleController.deleteArticle);

export default router;
