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

      {/* Footer buttons*/}
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

        {/* Edit & Delete */}
        {user && user.id === post.user?._id && (
          <div
            className="flex items-center gap-2 sm:gap-3 ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onEdit}
              className="flex items-center justify-center p-1 rounded text-xs sm:text-sm font-medium focus:outline-none text-[#767676] hover:text-gray-900 transition-colors duration-200"
              aria-label="Edit post"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 32 32"
                className="transition-colors duration-200 h-4 w-4 sm:h-[18px] sm:w-[18px]"
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
              >
                <path d="M12.965,5.462c0,-0 -2.584,0.004 -4.979,0.008c-3.034,0.006 -5.49,2.467 -5.49,5.5l0,13.03c0,1.459 0.579,2.858 1.611,3.889c1.031,1.032 2.43,1.611 3.889,1.611l13.003,0c3.038,-0 5.5,-2.462 5.5,-5.5c0,-2.405 0,-5.004 0,-5.004c0,-0.828 -0.672,-1.5 -1.5,-1.5c-0.827,-0 -1.5,0.672 -1.5,1.5l0,5.004c0,1.381 -1.119,2.5 -2.5,2.5l-13.003,0c-0.663,-0 -1.299,-0.263 -1.768,-0.732c-0.469,-0.469 -0.732,-1.105 -0.732,-1.768l0,-13.03c0,-1.379 1.117,-2.497 2.496,-2.5c2.394,-0.004 4.979,-0.008 4.979,-0.008c0.828,-0.002 1.498,-0.675 1.497,-1.503c-0.001,-0.828 -0.675,-1.499 -1.503,-1.497Z" />
                <path d="M20.046,6.411l-6.845,6.846c-0.137,0.137 -0.232,0.311 -0.271,0.501l-1.081,5.152c-0.069,0.329 0.032,0.671 0.268,0.909c0.237,0.239 0.577,0.343 0.907,0.277l5.194,-1.038c0.193,-0.039 0.371,-0.134 0.511,-0.274l6.845,-6.845l-5.528,-5.528Zm1.415,-1.414l5.527,5.528l1.112,-1.111c1.526,-1.527 1.526,-4.001 -0,-5.527c-0.001,-0 -0.001,-0.001 -0.001,-0.001c-1.527,-1.526 -4.001,-1.526 -5.527,-0l-1.111,1.111Z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="flex items-center justify-center p-1 rounded text-xs sm:text-sm font-medium focus:outline-none text-[#767676] hover:text-gray-900 transition-colors duration-200"
              aria-label="Delete post"
            >
              <svg
                fill="currentColor"
                height="16"
                width="16"
                viewBox="0 -0.5 21 21"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-colors duration-200 sm:h-[18px] sm:w-[18px]"
              >
                <g fill="none" fillRule="evenodd">
                  <g transform="translate(-179 -360)" fill="currentColor">
                    <g transform="translate(56 160)">
                      <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" />
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
