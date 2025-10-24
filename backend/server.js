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


app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend running",
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts',require('./routes/posts'));
app.use('/api/upload',require('./routes/upload'));
app.use('/api/users', require('./routes/users'));
app.use('/api', require('./routes/follow'));



app.use((err, req, res, next) => {
  console.error(err.stack);

  let statusCode = 500;
  let errorMessage = 'Server Error';

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorMessage = 'Token is not valid';
  } else if (err.status) { 
    statusCode = err.status;
    errorMessage = err.message;
  }

  if (process.env.NODE_ENV !== 'production') {
    return res.status(statusCode).json({ message: err.message, error: err });
  }

  res.status(statusCode).json({ message: errorMessage });
});

app.listen(PORT, ()=>{
  console.log(`Server is running on ${PORT}`);
})
