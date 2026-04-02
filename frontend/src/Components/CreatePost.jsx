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
      const uploadedFileUrl = await uploadFile(selectedFile);

      const finalPostData = {
        ...postData,
        fileUrl: uploadedFileUrl,
        tags: postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      await createPost(finalPostData);

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 1000);
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
    <div className="dark-card">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Create a New Post</h2>
        {error && <div className="auth-error">{error}</div>}
        {isSuccess && <div className="auth-success">Successfully posted!</div>}

        <input
          name="headline"
          placeholder="Headline..."
          value={postData.headline}
          onChange={handleChange}
          className="dark-input mb-3"
          required
        />
        <textarea
          name="text"
          placeholder="What's on your mind?"
          value={postData.text}
          onChange={handleChange}
          className="dark-input mb-3"
          rows="3"
          required
          style={{ resize: 'vertical' }}
        ></textarea>

        <div className="mb-3">
          <label htmlFor="file-upload" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Upload Material
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            required
          />
        </div>

        {showTagsInput && (
          <input
            name="tags"
            placeholder="Tags (e.g., #ece, #notes)"
            value={postData.tags}
            onChange={handleChange}
            className="dark-input mb-3"
          />
        )}

        <div className="flex justify-between items-center mt-2">
          <button
            type="button"
            onClick={() => setShowTagsInput(!showTagsInput)}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            title="Add Tags"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 1792 1792"
              fill="currentColor"
            >
              <path d="m991 1024 64-256H801l-64 256h254zm768-504-56 224q-7 24-31 24h-327l-64 256h311q15 0 25 12 10 14 6 28l-56 224q-5 24-31 24h-327l-81 328q-7 24-31 24H873q-16 0-26-12-9-12-6-28l78-312H665l-81 328q-7 24-31 24H328q-15 0-25-12-9-12-6-28l78-312H64q-15 0-25-12-9-12-6-28l56-224q7-24 31-24h327l64-256H200q-15 0-25-12-10-14-6-28l56-224q5-24 31-24h327l81-328q7-24 32-24h224q15 0 25 12 9 12 6 28l-78 312h254l81-328q7-24 32-24h224q15 0 25 12 9 12 6 28l-78 312h311q15 0 25 12 9 12 6 28z" />
            </svg>
          </button>
          <button
            type="submit"
            className="btn-primary"
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