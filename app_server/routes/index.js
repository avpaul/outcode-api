var express = require('express');
var router = express.Router();
var gen = require('../controller/general');
var blog = require('../controller/blog');
var comment = require('../controller/comments');

// HOME
router.get('/', gen.home);

// BLOG/ARTICLES
router.get('/blog', blog.getAll)
router.get('/blog/:title', blog.getOne)
router.get('/blog?category', blog.getCategory);
router.get('/blog?tag', blog.getTag);

// COMMENTS
router.get('/comments', comment.get);
router.post('/comments/new', comment.new);
router.post('/comments/update', comment.update);
router.post('/comments/reply', comment.reply);
router.delete('/comments/delete', comment.delete);

// OTHERS
router.get('/projects', gen.projects);
router.get('/ressources', gen.ressource);
router.get('/about', gen.about);
router.get('/about#work', gen.about);
router.get('/about#contact', gen.about);

module.exports = router;