const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', memberController.getMembers);
router.get('/:id', memberController.getMemberById);
router.put('/:id', protect, memberController.updateMemberProfile);
router.post('/', protect, authorize('admin'), memberController.createMember);

module.exports = router;
