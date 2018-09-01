var express = require('express');
var router = express.Router();

var artCtrl = require('../controllers/articles');
var editorCtrl = require('../controllers/editor');

// articles
router.get('/article/:id', artCtrl.readArticle);
router.post('/article/new', artCtrl.createArticle);
router.post('/article/update', artCtrl.updateArticle);
router.post('/article/delete', artCtrl.deleteArticle);


// article comments
router.get('/comment/:id', artCtrl.readComment);
router.post('/comment/new', artCtrl.addComment);
router.post('/comment/update', artCtrl.updateComment);
router.post('/comment/delete', artCtrl.deleteComment);

//Editor
router.post('/uploads/editor', editorCtrl.uploads);

module.exports = router;