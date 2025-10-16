const mongoose = require('mongoose');
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
    const posts = await Post.find().populate('user', 'name photo').sort({ date: -1 });
    
    const userId = req.user?.id?.toString();

    const result = posts.map(post => {
      const liked = userId
        ? post.likes.some(id => id.toString() === userId)
        : false; 

      const obj = post.toObject();

      delete obj.likes;

      return {
        ...obj,
        liked,
        likesCount: post.likesCount,
        comments:post.comments,
        commentsCount:post.commentsCount
      };
    });

    res.json(result);
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

const toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    let post = await Post.findOneAndUpdate(
      { _id: postId, likes: { $ne: userId } }, 
      { $addToSet: { likes: userId }, $inc: { likesCount: 1 } }, 
      { new: true, select: 'likesCount likes' }
    );

    if (post) {
      return res.json({ liked: true, likesCount: post.likesCount });
    }

    post = await Post.findOneAndUpdate(
      { _id: postId, likes: userId },   
      { $pull: { likes: userId }, $inc: { likesCount: -1 } }, 
      { new: true, select: 'likesCount likes' }
    );

    if (post) {
      return res.json({ liked: false, likesCount: post.likesCount });
    }

    return res.status(404).json({ error: 'Post not found' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

const getLikeMeta = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await Post.findById(postId).select('likes likesCount');
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const liked = post.likes.some(
      id => id.toString() === userId.toString()
    );

    res.json({ liked, likesCount: post.likesCount });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

const addComment =async(req,res)=>{
  try{
    const userId = req.user.id;
    const postId = req.params.postId;

    const {text}=req.body;

    const comment = {text,user:userId,createdAt:new Date()};
    const post=await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: comment },
        $inc:{commentsCount:1}
      },
      {new: true}
    ).populate('comments.user', 'name photo'); // show commenter info

    const newComment = post.comments[post.comments.length - 1];
    res.json({ comment: newComment, commentsCount: post.commentsCount });
  } catch (err){
    res.status(500).json({ error: err.message || 'Server error' });
  }
}

const getComments =async(req,res)=>{
  try{
    const post = await Post.findById(req.params.postId)
      .populate('comments.user', 'username profilePic');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json({ comments: post.comments });
  }catch(err){
    res.status(500).json({ error: err.message || 'Server error' });
  }
}

const deleteComment =async(req,res)=>{
  try{
    let post = await Post.findById(req.params.postId);;
    if (!post) return res.status(404).send("Not Found")

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).send("Comment not found");

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed, You can only delete your own comment.")
    }

    comment.deleteOne(); 
    await post.save();

    post.commentsCount = post.comments.length;
    await post.save();

    res.json({
      success: true,
      message: "Comment has been deleted",
      commentId: req.params.commentId
    });
  }catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
}


module.exports = { createPost, getPosts, deletePost, updatePost, getPostsByUser, toggleLike, getLikeMeta, addComment, getComments, deleteComment };