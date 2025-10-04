const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

router.get('/:userId', getUserProfile);
router.put('/me', authMiddleware, updateUserProfile);

module.exports = router;