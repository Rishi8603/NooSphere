import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="dark-card">
      <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Editing Post</h3>

      <div className="mb-3">
        <input
          name="headline"
          value={formData.headline}
          onChange={handleChange}
          className="dark-input"
          placeholder="Headline"
        />
      </div>

      <div className="mb-3">
        <textarea
          name="text"
          value={formData.text}
          onChange={handleChange}
          className="dark-input"
          rows="3"
          placeholder="Write your post..."
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="mb-3">
        <input
          name="fileUrl"
          value={formData.fileUrl}
          onChange={handleChange}
          className="dark-input"
          placeholder="File URL"
        />
      </div>

      <div className="mb-4">
        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="dark-input"
          placeholder="Comma-separated tags"
        />
      </div>

      <div className="flex space-x-2">
        <button type="submit" className="btn-primary">
          Save
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditPost;