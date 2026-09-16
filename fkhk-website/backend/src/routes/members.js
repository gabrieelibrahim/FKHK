const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', memberController.getMembers);
router.get('/:id', memberController.getMemberById);
router.put('/:id', protect, memberController.updateMemberProfile);
router.put('/:id/admin', protect, authorize('admin'), memberController.updateMemberByAdmin);
router.post('/', protect, authorize('admin'), memberController.createMember);
router.delete('/:id', protect, authorize('admin'), memberController.deleteMember);

module.exports = router;
