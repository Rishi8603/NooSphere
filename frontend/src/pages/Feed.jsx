import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import EditPost from '../Components/EditPost';
import { Link, useNavigate } from 'react-router-dom';

const Feed = ({ posts, loading, onDelete, onUpdate, onToggleLike }) => {
  const { user } = useContext(AuthContext);
  const [editingPostId, setEditingPostId] = useState(null);
  const navigate=useNavigate();

  if (loading) return <p>Loading posts...</p>;
  if (posts.length === 0) return <p>No posts yet. Be the first to create one!</p>;

  const handleUpdate = (postId, updatedData) => {
    onUpdate(postId, updatedData);
    setEditingPostId(null); // Exit edit mode after updating
  };

  return (
    <div className="space-y-2">
      {posts
        .filter(post => post && post._id && post.user)
        .map(post =>
          editingPostId === post._id ? (
            <EditPost
              key={post._id}
              post={post}
              onSave={handleUpdate}
              onCancel={() => setEditingPostId(null)}
            />
          ) : (
            <PostCard
              key={post._id}
              post={post}
              user={user}
              onDelete={onDelete}
              onToggleLike={onToggleLike}
              onEdit={() => setEditingPostId(post._id)}
            />
          )
        )}
    </div>
  );
};

function PostCard({ post, user, onDelete, onToggleLike, onEdit }) {
  const navigate = useNavigate();
  const handleLikeClick = async () => {
    try {
      await onToggleLike(post._id);
    } catch (error) {
      // Revert state changes if API fails
      setLiked(prevLiked);
      setLikesCount(prevCount);
      alert("Failed to update like. Try again!");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white relative">
      <div className="absolute top-2 right-2 flex space-x-2">
        {user && user.id === post.user?._id && (
          <>
            <button
              onClick={onEdit}
              className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>
      <Link to={`/user/${post.user._id}`} className="flex items-center gap-2 mb-2 hover:bg-gray-100 p-1 rounded transition">
        <img
          src={post.user.photo || `https://ui-avatars.com/api/?name=${post.user.name}`}
          alt={post.user.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
        />
        <span className="font-semibold text-gray-700">{post.user.name}</span>
      </Link>
      <h2 className="text-2xl font-semibold">{post.headline}</h2>
      <div className="text-sm text-gray-500 mt-1">
        <span>Posted by: <strong>{post.user?.name || 'Unknown User'}</strong></span>
        <span className="mx-2">|</span>
        <span>{new Date(post.date).toLocaleDateString()}</span>
      </div>
      <p className="mt-1 text-gray-700">{post.text}</p>
      <div className="mt-2">
        <a href={post.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          View Material
        </a>
      </div>
      <div className="mt-1">
        {post.tags.map(tag => (
          <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            #{tag}
          </span>
        ))}
      </div>

      <div className="border-t pt-3 mt-3 flex items-center gap-6">
        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          style={{
            color: post.liked ? "#e0245e" : "#767676"
          }}
        >
          {post.liked ? "♥" : "♡"} {post.likesCount}

        </button>
        {/* Comment Button */}
        <button
          className="flex items-center gap-1 text-lg font-semibold focus:outline-none text-[#767676] hover:text-blue-600"
          onClick={() => navigate(`/posts/${post._id}`)}
        >
          💬 
          <span className="text-base">{post.commentsCount ?? 0}</span>
        </button>
      </div>
    </div>
  );
}

export default Feed;
