const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { protect, authorize } = require('../middleware/auth');

router.post('/subscribe', newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);
router.get('/status', protect, authorize('admin'), newsletterController.status);

module.exports = router;
