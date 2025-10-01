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
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showTagsInput, setShowTagsInput] = useState(false);

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
    <div className="p-1 border rounded-lg shadow-md bg-white">
      <form onSubmit={handleSubmit}>
        <h2 className="text-1xl font-bold mb-1">Create a New Post</h2>
        {error && <p className="text-red-500 mb-1">{error}</p>}
        {isSuccess && <p className="text-green-500 mb-1">Successfully posted!</p>}

        {/* All your input fields were perfect, no changes needed here */}
        <input
          name="headline"
          placeholder="Headline"
          value={postData.headline}
          onChange={handleChange}
          className="mb-1 p-1 border w-full rounded"
        />
        <textarea
          name="text"
          placeholder="Body"
          value={postData.text}
          onChange={handleChange}
          className="mb-1 p-1 border w-full rounded"
        ></textarea>
        {showUrlInput && (
          <input
            name="fileUrl"
            type="url"
            placeholder="File URL (e.g., https://...)"
            value={postData.fileUrl}
            onChange={handleChange}
            className="mb-1 p-1 border w-full rounded"
          />
        )}
        {showTagsInput && (
          <input
            name="tags"
            placeholder="Tags (e.g., #ece, #notes)"
            value={postData.tags}
            onChange={handleChange}
            className="mb-1 p-1 border w-full rounded"
          />
        )}
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full"
              title="Add Link"
            >
              📎 
            </button>
            <button
              type="button"
              onClick={() => setShowTagsInput(!showTagsInput)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full"
              title="Add Tags"
            >
              #️⃣ 
            </button>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600">
            Post
          </button>
        </div>      </form>
    </div>
  );
}


export default CreatePost;