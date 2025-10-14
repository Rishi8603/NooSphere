const User = require('../models/User');
const Post = require('../models/Post'); 
const cloudinary = require("cloudinary").v2;

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

    if (req.file) {
      const uploadFromBuffer = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "profile_avatars" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(buffer);
        });
      };

      const result = await uploadFromBuffer(req.file.buffer);
      updatedFields.photo = result.secure_url;
    }

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

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndDelete(userId);

    await Post.deleteMany({ user: userId });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete account" });
  }
};


module.exports = { getUserProfile, updateUserProfile, deleteAccount };