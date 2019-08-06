import express from 'express';
import articleController from '../controllers/articleController';

const router = express.Router();

router.get('/articles?page&limit', articleController.getArticles);
router.get('/articles/:slug', articleController.getArticle);
router.get('/articles?tag', articleController.getArticlesByTag);
router.post('/articles', articleController.createArticle);
router.put('/articles/:slug', articleController.updateArticle);
router.delete('/articles', articleController.deleteArticle);

export default router;
