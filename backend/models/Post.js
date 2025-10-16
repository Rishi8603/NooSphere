const mongoose=require('mongoose');

const PostSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  headline:{
    type:String,
    required:true
  },
  text:{
    type:String,
    required:true
  },
  fileUrl:{
    type:String,
    required:false
  },
  tags:{
    type:[String],
    default:[]
  },
  date:{
    type:Date,
    default:Date.now
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  likesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  commentsCount:{
    type:Number,
    default:0,
    min:0
  }
});

module.exports=mongoose.model('Post',PostSchema);