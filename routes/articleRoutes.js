import express from 'express';
import articleValidator from '../middleware/validation/articleValidation';
import articleController from '../controllers/articleController';

const router = express.Router();

router.get('/articles?page&limit', articleController.getArticles);
router.get(
  '/articles/:slug',
  articleValidator.slug,
  articleValidator.slug,
  articleController.getArticle
);
router.get('/articles?tag', articleController.getArticlesByTag);
router.post('/articles', articleValidator.createOrUpdate, articleController.createArticle);
router.put(
  '/articles/:slug',
  articleValidator.slug,
  articleValidator.createOrUpdate,
  articleController.updateArticle
);
router.delete('/articles', articleValidator.slug, articleController.deleteArticle);

export default router;
