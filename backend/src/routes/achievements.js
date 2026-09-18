const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', achievementController.getAchievements);
router.post('/', protect, authorize('admin'), achievementController.createAchievement);
router.put('/:id', protect, authorize('admin'), achievementController.updateAchievement);
router.delete('/:id', protect, authorize('admin'), achievementController.deleteAchievement);

module.exports = router;
