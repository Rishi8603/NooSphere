require('dotenv').config();
const express=require('express');
const connectDB = require('./config/db');
const cors=require('cors')
const mongoose =require('mongoose')
const connectCloudinary=require('./config/cloudinary');

// Connect to the database
connectDB();
connectCloudinary();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts',require('./routes/posts'));
app.use('/api/upload',require('./routes/upload'));
app.use('/api/users', require('./routes/users'));


app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(500).json({message: err.message +"error hei bhai..Server.js se bol rha hun"})
})

app.listen(PORT, ()=>{
  console.log(`Server is running on ${PORT}`);
})
