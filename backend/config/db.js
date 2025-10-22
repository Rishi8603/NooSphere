const mongoose = require('mongoose');

// const mongoURI = "mongodb://localhost:27017/my-auth-app"; // OLD
const mongoURI = process.env.mongoURI; // NEW

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log(mongoURI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;