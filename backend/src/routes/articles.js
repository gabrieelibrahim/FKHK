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

// Admin: approve / reject (superadmin & admin_kaset)
router.put('/:id/publish', protect, authorize('superadmin', 'admin_kaset'), articleController.approveArticle);
router.put('/:id/reject', protect, authorize('superadmin', 'admin_kaset'), articleController.rejectArticle);

module.exports = router;
