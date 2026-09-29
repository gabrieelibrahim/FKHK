const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect, optionalProtect, authorize } = require('../middleware/auth');

const ADMIN_ROLES = ['superadmin', 'admin_kaset', 'admin_psdm', 'admin_bph', 'admin'];

// Public — approved comments (+ own if logged in)
router.get('/article/:articleId', optionalProtect, commentController.getArticleComments);

// Member — post comment
router.post('/article/:articleId', protect, commentController.createComment);

// Admin — moderation list
router.get('/', protect, authorize(...ADMIN_ROLES), commentController.listComments);

// Admin — approve
router.put('/:id/approve', protect, authorize(...ADMIN_ROLES), commentController.approveComment);

// Admin or author — delete
router.delete('/:id', protect, commentController.deleteComment);

module.exports = router;
