const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, optionalProtect, authorize } = require('../middleware/auth');

const ADMIN_ROLES = ['superadmin', 'admin_kaset', 'admin_psdm', 'admin_bph', 'admin'];

// Public
router.get('/', optionalProtect, eventController.getEvents);
router.get('/presensi/active', eventController.getActiveEventsForPresensi);
// Presensi wajib login anggota — optionalProtect agar menghasilkan 401 custom jika tidak ada token
router.post('/presensi/record', optionalProtect, eventController.recordPresensi);
router.get('/:slug', optionalProtect, eventController.getEventBySlug);

// Protected (Admin)
router.post('/', protect, authorize(...ADMIN_ROLES), eventController.createEvent);
router.put('/:id', protect, authorize(...ADMIN_ROLES), eventController.updateEvent);
router.delete('/:id', protect, authorize(...ADMIN_ROLES), eventController.deleteEvent);
router.get('/:id/registrations', protect, authorize(...ADMIN_ROLES), eventController.getRegistrations);

// Registration (Public or Member)
router.post('/:id/register', optionalProtect, eventController.registerForEvent);
router.delete('/:id/register', protect, eventController.unregisterFromEvent);

module.exports = router;
