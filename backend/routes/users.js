const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const multer=require('multer');
const upload = multer();

router.get('/:userId', getUserProfile);
router.put('/me', authMiddleware, upload.single('photo'), updateUserProfile);

module.exports = router;