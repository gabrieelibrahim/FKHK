const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('superadmin', 'admin_bph'), memberController.getMembers);
router.get('/:id', protect, authorize('superadmin'), memberController.getMemberById);
router.put('/:id', protect, memberController.updateMemberProfile);
router.put('/:id/admin', protect, authorize('superadmin'), memberController.updateMemberByAdmin);
router.post('/', protect, authorize('superadmin', 'admin_bph'), memberController.createMember);
router.delete('/:id', protect, authorize('superadmin'), memberController.deleteMember);

module.exports = router;
