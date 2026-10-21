const express = require('express');
const router = express.Router();
const letterController = require('../controllers/letterController');
const { protect, authorize } = require('../middleware/auth');

// Public route untuk verifikasi QR Code surat oleh pihak kampus / instansi luar
router.get('/verify/:letterNumber', letterController.verifyLetterPublic);

// Protected routes — Akses baca & statistik untuk superadmin, sekretaris, dan admin_kaset
router.get('/preview-number', protect, authorize('superadmin', 'sekretaris', 'admin_kaset'), letterController.previewNumber);
router.get('/stats', protect, authorize('superadmin', 'sekretaris', 'admin_kaset'), letterController.getStats);
router.get('/', protect, authorize('superadmin', 'sekretaris', 'admin_kaset'), letterController.getLetters);
router.get('/:id', protect, authorize('superadmin', 'sekretaris', 'admin_kaset'), letterController.getLetterById);

// Generator & Void — Dibatasi ketat HANYA untuk role 'sekretaris' dan 'superadmin'
router.post('/', protect, authorize('superadmin', 'sekretaris'), letterController.createLetter);
router.put('/:id/void', protect, authorize('superadmin', 'sekretaris'), letterController.voidLetter);

module.exports = router;
