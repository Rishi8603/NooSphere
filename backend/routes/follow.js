const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authMiddleware = require('../middleware/authMiddleware'); // must protect follow/unfollow

router.post('/users/:id/follow', authMiddleware, followController.followUser);
router.delete('/users/:id/unfollow', authMiddleware, followController.unfollowUser);
router.get('/users/:id/followers', followController.getFollowers);
router.get('/users/:id/following', followController.getFollowing);

module.exports = router;
