const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { protect, authorize } = require('../middleware/auth');

const ADMIN_ROLES = ['superadmin', 'admin_kaset', 'admin_psdm', 'admin'];

router.post('/subscribe', newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);
router.get('/status', protect, authorize(...ADMIN_ROLES), newsletterController.status);

module.exports = router;
