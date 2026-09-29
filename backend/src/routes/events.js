const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

const ADMIN_ROLES = ['superadmin', 'admin_kaset', 'admin_psdm', 'admin_bph', 'admin'];

// Public
router.get('/', eventController.getEvents);
router.get('/:slug', eventController.getEventBySlug);

// Protected
router.post('/', protect, authorize(...ADMIN_ROLES), eventController.createEvent);
router.put('/:id', protect, authorize(...ADMIN_ROLES), eventController.updateEvent);
router.delete('/:id', protect, authorize(...ADMIN_ROLES), eventController.deleteEvent);
router.post('/:id/register', protect, eventController.registerForEvent);
router.delete('/:id/register', protect, eventController.unregisterFromEvent);
router.get('/:id/registrations', protect, authorize(...ADMIN_ROLES), eventController.getRegistrations);

module.exports = router;
