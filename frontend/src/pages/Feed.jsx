import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import EditPost from '../Components/EditPost';
import { Link, useNavigate } from 'react-router-dom';

const Feed = ({ posts, loading, onDelete, onUpdate, onToggleLike }) => {
  const { user } = useContext(AuthContext);
  const [editingPostId, setEditingPostId] = useState(null);
  const navigate = useNavigate();

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

  const handleLikeClick = async (e) => {
    e.stopPropagation(); // Prevent post navigation
    try {
      await onToggleLike(post._id);
    } catch (error) {
      alert("Failed to update like. Try again!");
    }
  };

  const handlePostClick = () => {
    navigate(`/posts/${post._id}`);
  };

  return (
    <div
      className="p-4 border rounded-lg shadow bg-white relative cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handlePostClick}
    >
      {/* User header */}
      <Link
        to={`/user/${post.user._id}`}
        className="flex items-center gap-2 mb-2 hover:bg-gray-100 p-1 rounded transition"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={post.user.photo || `https://ui-avatars.com/api/?name=${post.user.name}`}
          alt={post.user.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
        />
        <span className="font-semibold text-gray-700">{post.user.name}</span>
      </Link>

      {/* Post content */}
      <h2 className="text-xl sm:text-2xl font-semibold break-words">{post.headline}</h2>
      <div className="text-xs sm:text-sm text-gray-500 mt-1">
        <span>
          Posted by: <strong>{post.user?.name || "Unknown User"}</strong>
        </span>
        <span className="mx-2">|</span>
        <span>{new Date(post.date).toLocaleDateString()}</span>
      </div>
      <p className="mt-1 text-sm sm:text-base text-gray-700 break-words">{post.text}</p>

      {/* File */}
      <div className="mt-2">
        <a
          href={post.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm sm:text-base"
          onClick={(e) => e.stopPropagation()}
        >
          View Material
        </a>
      </div>

      {/* Tags */}
      <div className="mt-1 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-gray-200 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-gray-700"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer buttons - All in one line */}
      <div className="border-t pt-3 mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className="flex items-center gap-1 text-xs sm:text-sm font-medium focus:outline-none"
            style={{
              color: post.liked ? "#e0245e" : "#767676",
            }}
          >
            <svg
              fill="currentColor"
              height="16"
              width="16"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200 sm:h-[18px] sm:w-[18px]"
            >
              <path d="M10 19a3.966 3.966 0 01-3.96-3.962V10.98H2.838a1.731 1.731 0 01-1.605-1.073 1.734 1.734 0 01.377-1.895L9.364.254a.925.925 0 011.272 0l7.754 7.759c.498.499.646 1.242.376 1.894-.27.652-.9 1.073-1.605 1.073h-3.202v4.058A3.965 3.965 0 019.999 19H10zM2.989 9.179H7.84v5.731c0 1.13.81 2.163 1.934 2.278a2.163 2.163 0 002.386-2.15V9.179h4.851L10 2.163 2.989 9.179z"></path>
            </svg>
            <span>{post.likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            className="flex items-center gap-1 text-xs sm:text-sm font-medium focus:outline-none text-[#767676] hover:text-blue-600 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/posts/${post._id}`);
            }}
          >
            <svg
              fill="currentColor"
              height="16"
              width="16"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200 sm:h-[18px] sm:w-[18px]"
            >
              <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2z"></path>
            </svg>
            <span>{post.commentsCount ?? 0}</span>
          </button>
        </div>

        {/* Edit & Delete - Stays on same line */}
        {user && user.id === post.user?._id && (
          <div className="flex items-center gap-1 sm:gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onEdit}
              className="bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-yellow-600 whitespace-nowrap"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600 whitespace-nowrap"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;