const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', achievementController.getAchievements);
router.post('/', protect, authorize('superadmin', 'admin_psdm'), achievementController.createAchievement);
router.put('/:id', protect, authorize('superadmin', 'admin_psdm'), achievementController.updateAchievement);
router.delete('/:id', protect, authorize('superadmin', 'admin_psdm'), achievementController.deleteAchievement);

module.exports = router;
