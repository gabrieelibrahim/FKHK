const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');

router.get('/', achievementController.getAchievements);
router.post('/', protect, achievementController.createAchievement);

module.exports = router;
