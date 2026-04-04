const bcrypt = require('bcrypt');
const User = require('../models/User');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }
    const lowerCaseEmail = email.toLowerCase();

    let user = await User.findOne({ email: lowerCaseEmail });
    if (user) {
      return res.status(400).json({ error: "can't create, account already exists!" })
    }

    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt)

    user = await User.create({//user.create se automatic db mein save ho jata hei
      name: name,
      email: lowerCaseEmail,
      password: hashedPass,
    })

    res.json({ success: true, message: "user registered" })
  }
  catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error signup(authController)")
  }
}

//importing middleware
const authMiddleware = require('../middleware/authMiddleware')
const jwt = require('jsonwebtoken')
const JwtSecret = process.env.JWT_SECRET;


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }
    const lowerCaseEmail = email.toLowerCase();

    let user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found in db" })
    }

    const passwordComp = await bcrypt.compare(password, user.password);
    if (!passwordComp) return res.status(401).json({ error: "Wrong password!" })

    //if password match ho jata hei than jwt generate kro 
    const payload = {
      //payload wo data hei jo hum token ke andr rakhna chahte hein
      //yhaan hum sirf user ki uniqueId rakhenge...isse jab bhi user ye token
      //wapas bhejega, hum is ID se pata laga sakte hein ki kaunsa user hei
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }

    //jwt.sign() function payload ar secret key milakar ek unique token string
    //generate krega
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
}

//Google OAuth login
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "Google ID token is required" });
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const googlePayload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = googlePayload;

    // Find existing user or create new one
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // New user — create account
      user = await User.create({
        name: name,
        email: email.toLowerCase(),
        googleId: googleId,
        photo: picture || "",
      });
    } else if (!user.googleId) {
      // Existing email/password user — link Google account
      user.googleId = googleId;
      if (!user.photo && picture) user.photo = picture;
      await user.save();
    }

    // Generate JWT (same format as normal login)
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    };
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, authToken });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(500).json({ error: "Google authentication failed" });
  }
};

const guestLogin = async (req, res) => {
  try {
    const guestEmail = "guest@noosphere.demo";

    let user = await User.findOne({ email: guestEmail });

    if (!user) {
      // Create the guest account once with a random unusable password
      const salt = await bcrypt.genSalt(10);
      const randomPass = await bcrypt.hash(Date.now().toString() + Math.random(), salt);

      user = await User.create({
        name: "Guest User",
        email: guestEmail,
        password: randomPass,
        bio: "👋 I'm exploring NooSphere as a guest!",
      });
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    };

    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ success: true, authToken });
  } catch (error) {
    console.error("Guest login error:", error.message);
    res.status(500).json({ error: "Guest login failed" });
  }
};

module.exports = { signup, login, googleLogin, guestLogin };