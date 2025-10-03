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

const getPosts = async (req, res) => {
  try {
    //.populate() in Mongoose is a method that replaces a referenced ObjectId in a document
    // with the actual document from another collection.
    const posts = await Post.find().populate('user', 'name').sort({ date: -1 });    
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

const deletePost= async(req,res)=>{
  try{
    let post=await Post.findById(req.params.id);
    if(!post){
      return res.status(404).send("Not Found")
    }

    //check if user trying to delete the post is the one who created it
    if(post.user.toString() !==req.user.id){
      return res.status(401).send("Not Allowed, you hadn't created this post")
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({"Success:":"Post has been deleted", post:post})
  }catch(error){
    console.error(error.message)
    res.status(500).send("Internal Server Error");
  }
}

const updatePost = async (req, res) => {
  try {
    const { headline, text, fileUrl, tags } = req.body;

    const newPostData = {};
    if (headline) { newPostData.headline = headline; }
    if (text) { newPostData.text = text; }
    if (fileUrl) { newPostData.fileUrl = fileUrl; }
    if (tags) { newPostData.tags = tags; }

    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Not Found");
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: newPostData },
      { new: true } // {new: true} tells Mongoose to return the document after the update
    ).populate('user','name');

    res.json({ post });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'name')
      .sort({ date: -1 });

    res.json(posts);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { createPost, getPosts, deletePost, updatePost,getPostsByUser };