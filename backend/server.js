require('dotenv').config();
const express=require('express');
const connectDB = require('./config/db');
const cors=require('cors')
const mongoose =require('mongoose')

// Connect to the database
connectDB();

const app = express();
const PORT = 5000; // Your chosen port

app.use(cors())
app.use(express.json())

const userRoutes=require('.routes/userRoutes')
const authRoutes=require('.routes/authRoutes')

//end point create kiye
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(500).json({message: err.message +"error hei bhai..Server.js se bol rha hun"})
})

app.listen(PORT, ()=>{
  console.log(`Server is running on ${PORT}`);
})
