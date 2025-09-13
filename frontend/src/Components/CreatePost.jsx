import React,{useState} from "react";
import { createPost } from "../services/postService";

const CreatePost = ({ onPostCreated })=>{
  const [postData,setPostData]=useState({
    headline:"",
    text:"",
    fileUrl:"",
    tags:"",
  })
  const [error,setError]=useState("");
  const [isSuccess,setIsSuccess]=useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalPostData = {
        ...postData,
        tags: postData.tags.split(',').map(tag => tag.trim()),
      };
      
      await createPost(finalPostData);
      
      //Call the parent's function to trigger a refresh!
      onPostCreated(); 
      
      // Clear the form for the next post
      setPostData({ headline: "", text: "", fileUrl: "", tags: "" });

    } catch (err) {
      setError(err.message || "Failed to create post.");
    }
  };

  const handleChange=(e)=>{
    setPostData({
      ...postData,
      [e.target.name]:e.target.value,
    })
  }
  return(
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-4 border rounded w-160">
        <h1 className="text-2xl mb-4">CreatePost</h1>
        {error && <p className="text-red-500">{error}</p>}
        {isSuccess && <p className="text-green-500">Successfully posted</p>}

        <input
          name="headline"
          placeholder="HeadLine"
          value={postData.headline}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />
        <input
          name="text"
          placeholder="Body"
          value={postData.text}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />
        <input
          name="fileUrl"
          type="url"
          placeholder="link"
          value={postData.fileUrl}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />
        <input
          name="tags"
          placeholder="#tag"
          value={postData.tags}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">Post</button>
      </form>
    </div>
  );
}


export default CreatePost;