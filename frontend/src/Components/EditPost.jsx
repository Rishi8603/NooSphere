import React, { useState } from 'react';

// The onSave prop comes from Homepage -> Feed -> EditPost
const EditPost = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    headline: post?.headline || "",
    text: post?.text || "",
    fileUrl: post?.fileUrl || "",
    tags: Array.isArray(post?.tags) ? post.tags.join(", ") : "",
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      const updatedData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()),
      };

      onSave(post._id, updatedData);

    } catch (err) {
      setError('Failed to save changes.');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold mb-2">Editing Post</h3>

      <div className="mb-2">
        <input
          name="headline"
          value={formData.headline}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Headline"
        />
      </div>

      <div className="mb-2">
        <textarea
          name="text"
          value={formData.text}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          placeholder="Write your post..."
        />
      </div>

      <div className="mb-2">
        <input
          name="fileUrl"
          value={formData.fileUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="File URL"
        />
      </div>

      <div className="mb-4">
        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Comma-separated tags"
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditPost;