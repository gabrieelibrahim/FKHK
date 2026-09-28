const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passwordController = require('../controllers/passwordController');

const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/me', protect, authController.me);

// Password reset flow
router.post('/forgot-password', passwordController.forgotPassword);
router.post('/reset-password', passwordController.resetPassword);

module.exports = router;
