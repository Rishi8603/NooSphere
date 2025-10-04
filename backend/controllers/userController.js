const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password'); 

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const { name, bio } = req.body;
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (bio !== undefined) updatedFields.bio = bio;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getUserProfile, updateUserProfile };