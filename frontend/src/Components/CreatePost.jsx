import React, { useState } from "react";
import { createPost } from "../services/postService";
import { uploadFile } from "../services/uploadService";

const CreatePost = ({ onPostCreated }) => {
  const [postData, setPostData] = useState({
    headline: "",
    text: "",
    tags: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showTagsInput, setShowTagsInput] = useState(false);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSuccess(false);

    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Upload the file
      const uploadedFileUrl = await uploadFile(selectedFile);

      // Step 2: Create the post with the file URL
      const finalPostData = {
        ...postData,
        fileUrl: uploadedFileUrl,
        tags: postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      await createPost(finalPostData);

      // Reset the form
      setIsSuccess(true);
      onPostCreated();
      setPostData({ headline: "", text: "", tags: "" });
      setSelectedFile(null);
      setShowTagsInput(false);

    } catch (err) {
      setError(err.message || "Failed to create post.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {isSuccess && <p className="text-green-500 mb-2">Successfully posted!</p>}

        <input
          name="headline"
          placeholder="Headline..."
          value={postData.headline}
          onChange={handleChange}
          className="mb-2 p-2 border w-full rounded"
          required
        />
        <textarea
          name="text"
          placeholder="What's on your mind?"
          value={postData.text}
          onChange={handleChange}
          className="mb-2 p-2 border w-full rounded"
          rows="3"
          required
        ></textarea>

        <div className="mb-2">
          <label htmlFor="file-upload" className="block text-gray-700 font-semibold mb-1 text-sm">
            Upload Material
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        {showTagsInput && (
          <input
            name="tags"
            placeholder="Tags (e.g., #ece, #notes)"
            value={postData.tags}
            onChange={handleChange}
            className="mb-2 p-2 border w-full rounded"
          />
        )}

        <div className="flex justify-between items-center mt-2">
          <button
            type="button"
            onClick={() => setShowTagsInput(!showTagsInput)}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full"
            title="Add Tags"
          >
            #️⃣
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;