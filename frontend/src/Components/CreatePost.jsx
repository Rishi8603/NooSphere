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
    setError(""); // Clear previous errors
    setIsSuccess(false); // Reset success message
    try {
      const finalPostData = {
        ...postData,
        tags: postData.tags.split(',').map(tag => tag.trim()),
      };
      
      await createPost(finalPostData);
      setIsSuccess(true); // Show success message
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
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {isSuccess && <p className="text-green-500 mb-2">Successfully posted!</p>}

        {/* All your input fields were perfect, no changes needed here */}
        <input
          name="headline"
          placeholder="Headline"
          value={postData.headline}
          onChange={handleChange}
          className="mb-2 p-2 border w-full rounded"
        />
        <input
          name="text"
          placeholder="Body"
          value={postData.text}
          onChange={handleChange}
          className="mb-2 p-2 border w-full rounded"
        />
        <input
          name="fileUrl"
          type="url"
          placeholder="File URL (e.g., https://...)"
          value={postData.fileUrl}
          onChange={handleChange}
          className="mb-2 p-2 border w-full rounded"
        />
        <input
          name="tags"
          placeholder="Tags (e.g., #ece, #notes)"
          value={postData.tags}
          onChange={handleChange}
          className="mb-2 p-2 border w-full rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600">Post</button>
      </form>
    </div>
  );
}


export default CreatePost;