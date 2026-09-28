const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect, optionalProtect, authorize } = require('../middleware/auth');

// Public — approved comments (+ own if logged in)
router.get('/article/:articleId', optionalProtect, commentController.getArticleComments);

// Member — post comment
router.post('/article/:articleId', protect, commentController.createComment);

// Admin — moderation list
router.get('/', protect, authorize('admin'), commentController.listComments);

// Admin — approve
router.put('/:id/approve', protect, authorize('admin'), commentController.approveComment);

// Admin or author — delete
router.delete('/:id', protect, commentController.deleteComment);

module.exports = router;
