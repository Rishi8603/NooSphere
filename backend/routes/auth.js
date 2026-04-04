const express = require('express')
const router = express.Router()
const { signup, login, googleLogin, guestLogin } = require('../controllers/authController');

//routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/guest', guestLogin);


module.exports = router;