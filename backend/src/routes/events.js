const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

// Public
router.get('/', eventController.getEvents);
router.get('/:slug', eventController.getEventBySlug);

// Protected
router.post('/', protect, authorize('admin'), eventController.createEvent);
router.put('/:id', protect, authorize('admin'), eventController.updateEvent);
router.delete('/:id', protect, authorize('admin'), eventController.deleteEvent);
router.post('/:id/register', protect, eventController.registerForEvent);
router.delete('/:id/register', protect, eventController.unregisterFromEvent);
router.get('/:id/registrations', protect, authorize('admin'), eventController.getRegistrations);

module.exports = router;
