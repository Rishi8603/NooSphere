// controllers/followController.js
const Follow = require('../models/Follow');
const User = require('../models/User');

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.id; // Assumes authentication (req.user)
    const followingId = req.params.id;

    if (followerId.toString() === followingId) {
      return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user.' });
    }

    const follow = new Follow({ follower: followerId, following: followingId });
    await follow.save();

    res.status(201).json({ message: 'User followed successfully.', follow });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    // Remove the follow entry
    const result = await Follow.findOneAndDelete({ follower: followerId, following: followingId });

    if (!result) {
      return res.status(400).json({ message: 'You are not following this user.' });
    }

    res.status(200).json({ message: 'Unfollowed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;

    const followers = await Follow.find({ following: userId }).populate('follower', '_id name username photo profilePic');

    res.status(200).json({ followers: followers.map(f => f.follower) });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    const following = await Follow.find({ follower: userId }).populate('following', '_id name username photo profilePic');

    res.status(200).json({ following: following.map(f => f.following) });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
