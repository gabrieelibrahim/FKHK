const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect, optionalProtect, authorize } = require('../middleware/auth');

// Public (with optional auth for draft detection)
router.get('/', optionalProtect, articleController.getArticles);
router.get('/featured', articleController.getFeatured);
router.get('/:slug', optionalProtect, articleController.getArticleBySlug);

// Protected (members)
router.post('/', protect, articleController.createArticle);
router.put('/:id', protect, articleController.updateArticle);
router.delete('/:id', protect, articleController.deleteArticle);

// Submit for review (member)
router.put('/:id/submit', protect, articleController.submitArticle);

// Admin: approve / reject
router.put('/:id/publish', protect, authorize('admin'), articleController.approveArticle);
router.put('/:id/reject', protect, authorize('admin'), articleController.rejectArticle);

module.exports = router;
