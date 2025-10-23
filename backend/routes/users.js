const express = require('express');
const router = express.Router();
const { deleteAccount } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const multer=require('multer');
const upload = multer();

router.put('/me', authMiddleware, upload.single('photo'), updateUserProfile);
router.delete('/delete', authMiddleware, deleteAccount);
router.get('/:userId', getUserProfile);

module.exports = router;