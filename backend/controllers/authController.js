const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

const signup=async (req,res)=>{
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry nhi bn payega bcz account already existed" })
    }

    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPass
    })
    await user.save();
    res.json({ success: true, message: "user registered" })
  }
  catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error")
  }
}

//importing middleware
const authMiddleware=require('../middleware/authMiddleware')
const jwt = require('jsonwebtoken')
const JwtSecret = process.env.JwtSecret;

const login=async(req,res)=>{
  try{
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "please try again ladle" })
    }

    const passwordComp = await bcrypt.compare(req.body.password, user.password);
    if (!passwordComp) return res.status(400).json({ error: "glt password hei" })

    //if password match ho jata hei than jwt generate kro 
    const payload = {
      //payload wo data hei jo hum token ke andr rakhna chahte hein
      //yhaan hum sirf user ki uniqueId rakhenge...isse jab bhi user ye token
      //wapas bhejega, hum is ID se pata laga sakte hein ki kaunsa user hei
      user: {
        id: user.id
      }
    }
    //debugging
    console.log("JWT Secret being used:", process.env.JwtSecret);

    //jwt.sign() function payload ar secret key milakar ek unique token string
    //generate krega
    const authToken = jwt.sign(payload, JwtSecret);
    res.json({ success: true, authToken });
  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
}