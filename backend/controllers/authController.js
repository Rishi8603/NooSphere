const bcrypt = require('bcrypt');
const User = require('../models/User');

const signup=async (req,res)=>{
  try {
    const {name,email,password}=req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }
    const lowerCaseEmail=email.toLowerCase();

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
const authMiddleware=require('../middleware/authMiddleware')
const jwt = require('jsonwebtoken')
const JwtSecret = process.env.JWT_SECRET;


const login=async(req,res)=>{
  try{
    const {email, password}=req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }
    const lowerCaseEmail=email.toLowerCase();

    let user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found in db" })
    }

    const passwordComp = await bcrypt.compare(password, user.password);
    if (!passwordComp) return res.status(401).json({ error: "glt password hei" })

    //if password match ho jata hei than jwt generate kro 
    const payload = {
      //payload wo data hei jo hum token ke andr rakhna chahte hein
      //yhaan hum sirf user ki uniqueId rakhenge...isse jab bhi user ye token
      //wapas bhejega, hum is ID se pata laga sakte hein ki kaunsa user hei
      user: {
        id: user.id,
        name:user.name,
        email:user.email
      }
    }

    //jwt.sign() function payload ar secret key milakar ek unique token string
    //generate krega
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, authToken });
  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
}

module.exports = { signup, login };