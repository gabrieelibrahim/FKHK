const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect, optionalProtect } = require('../middleware/auth');

// Public (with optional auth for draft detection)
router.get('/', optionalProtect, articleController.getArticles);
router.get('/featured', articleController.getFeatured);
router.get('/:slug', articleController.getArticleBySlug);

// Protected (members)
router.post('/', protect, articleController.createArticle);
router.put('/:id/publish', protect, articleController.publishArticle);
router.put('/:id', protect, articleController.updateArticle);
router.delete('/:id', protect, articleController.deleteArticle);

module.exports = router;
