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
    required:true
  },
  tags:{
    type:[String],
    default:[]
  },
  date:{
    type:Date,
    default:Date.now
  }
});

module.exports=mongoose.model('Post',PostSchema);