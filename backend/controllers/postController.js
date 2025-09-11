const Post=require('../models/Post')

const createPost=async(req,res)=>{
  try{
    //we will get user id from req object,
    //which was added by our authMiddleware
    const userId=req.user.id;

    //we get the post details from request body
    const{headline, text, fileUrl, tags}=req.body;

    //create a new post object with data
    const newPost=new Post({
      headline,text,fileUrl,tags,
      user:userId,//link the post to logged in user
    })

    //save new post to db
    const savedPost=await newPost.save();
    res.json(savedPost)
  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

// --- Controller to GET all posts ---
const getPosts = async (req, res) => {
  try {
    // Find all posts and sort them by date (newest first)
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}


module.exports = { createPost, getPosts };