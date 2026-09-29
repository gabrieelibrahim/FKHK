const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', officerController.getOfficers);
router.post('/', protect, authorize('superadmin', 'admin_bph'), officerController.createOfficer);
router.put('/:id', protect, authorize('superadmin', 'admin_bph'), officerController.updateOfficer);
router.delete('/:id', protect, authorize('superadmin', 'admin_bph'), officerController.deleteOfficer);

module.exports = router;
