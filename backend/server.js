const express=require('express');
const dotenv=require('dotenv')
const cors=require('cors')
const mongoose =require('mongoose')

dotenv.config();
const PORT = process.env.PORT || 5000;

const app=express();

app.use(cors())
app.use(express.json())

const userRoutes=require('.routes/userRoutes')
const authRoutes=require('.routes/authRoutes')

//end point create kiye
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(500).json({message: err.message +"error hei bhai"})
})

app.listen(PORT, ()=>{
  console.log(`Server is running on ${PORT}`);
})
