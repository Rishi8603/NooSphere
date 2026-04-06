import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import EditPost from '../Components/EditPost';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/userService';

const Feed = ({ posts, loading, onDelete, onUpdate, onToggleLike }) => {
  const { user } = useContext(AuthContext);
  const [editingPostId, setEditingPostId] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      if (localStorage.getItem('hideInterestBanner') === 'true') {
        setShowBanner(false);
        return;
      }
      getUserProfile(user.id).then(data => {
        if (!data.academicInterests || data.academicInterests.trim() === '') {
          setShowBanner(true);
        }
      }).catch(err => console.error(err));
    }
  }, [user?.id]);

  if (loading) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Loading posts...</p>;
  if (posts.length === 0) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No posts yet. Be the first to create one!</p>;

  const handleUpdate = (postId, updatedData) => {
    onUpdate(postId, updatedData);
    setEditingPostId(null);
  };

  return (
    <div className="space-y-3">
      {showBanner && (
        <div className="dark-card" style={{ background: 'rgba(99, 102, 241, 0.1)', borderColor: '#6366f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: '#8b5cf6' }}>Personalize Your Feed!</h3>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Please update your academic interests in <Link to="/settings" className="hover:underline font-medium" style={{ color: '#6366f1' }}>Settings</Link> to help our AI rank the most relevant study materials for you.
            </p>
          </div>
          <button 
            onClick={() => {
              localStorage.setItem('hideInterestBanner', 'true');
              setShowBanner(false);
            }}
            className="text-gray-400 hover:text-white transition-colors"
            title="Don't show this again"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
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
    e.stopPropagation();
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
      className="dark-card cursor-pointer transition-all duration-200"
      onClick={handlePostClick}
      style={{ borderColor: 'var(--border-color)' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3a3a3a'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
    >
      <Link
        to={`/user/${post.user._id}`}
        className="flex items-center gap-2.5 mb-3 p-1.5 rounded-lg transition-colors duration-150"
        onClick={(e) => e.stopPropagation()}
        style={{ marginLeft: '-4px' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <img
          src={post.user.photo || `https://ui-avatars.com/api/?name=${post.user.name}&background=222&color=888`}
          alt={post.user.name}
          className="w-9 h-9 rounded-full object-cover"
          style={{ border: '2px solid var(--border-color)' }}
        />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{post.user.name}</span>
      </Link>

      <h2 className="text-lg sm:text-xl font-semibold break-words" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{post.headline}</h2>
      <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
        <span>
          {post.user?.name || "Unknown User"}
        </span>
        <span className="mx-2">·</span>
        <span>{new Date(post.date).toLocaleDateString()}</span>
      </div>
      <p className="mt-2 text-sm break-words leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{post.text}</p>

      <div className="mt-2.5">
        <a
          href={post.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-accent text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          View Material ↗
        </a>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span key={tag} className="dark-tag">
            #{tag}
          </span>
        ))}
      </div>

      <div className="pt-3 mt-3 flex items-center justify-between gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={handleLikeClick}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium focus:outline-none transition-colors duration-200"
            style={{ color: post.liked ? "#e0245e" : "var(--text-muted)" }}
          >
            <svg
              fill="currentColor"
              height="16"
              width="16"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className="sm:h-[18px] sm:w-[18px]"
            >
              <path d="M10 19a3.966 3.966 0 01-3.96-3.962V10.98H2.838a1.731 1.731 0 01-1.605-1.073 1.734 1.734 0 01.377-1.895L9.364.254a.925.925 0 011.272 0l7.754 7.759c.498.499.646 1.242.376 1.894-.27.652-.9 1.073-1.605 1.073h-3.202v4.058A3.965 3.965 0 019.999 19H10zM2.989 9.179H7.84v5.731c0 1.13.81 2.163 1.934 2.278a2.163 2.163 0 002.386-2.15V9.179h4.851L10 2.163 2.989 9.179z"></path>
            </svg>
            <span>{post.likesCount}</span>
          </button>

          <button
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium focus:outline-none transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/posts/${post._id}`);
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <svg
              fill="currentColor"
              height="16"
              width="16"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className="sm:h-[18px] sm:w-[18px]"
            >
              <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2z"></path>
            </svg>
            <span>{post.commentsCount ?? 0}</span>
          </button>
        </div>

        {user && user.id === post.user?._id && (
          <div
            className="flex items-center gap-2 sm:gap-3 ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onEdit}
              className="flex items-center justify-center p-1.5 rounded-lg text-xs sm:text-sm font-medium focus:outline-none transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              aria-label="Edit post"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 32 32"
                className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
              >
                <path d="M12.965,5.462c0,-0 -2.584,0.004 -4.979,0.008c-3.034,0.006 -5.49,2.467 -5.49,5.5l0,13.03c0,1.459 0.579,2.858 1.611,3.889c1.031,1.032 2.43,1.611 3.889,1.611l13.003,0c3.038,-0 5.5,-2.462 5.5,-5.5c0,-2.405 0,-5.004 0,-5.004c0,-0.828 -0.672,-1.5 -1.5,-1.5c-0.827,-0 -1.5,0.672 -1.5,1.5l0,5.004c0,1.381 -1.119,2.5 -2.5,2.5l-13.003,0c-0.663,-0 -1.299,-0.263 -1.768,-0.732c-0.469,-0.469 -0.732,-1.105 -0.732,-1.768l0,-13.03c0,-1.379 1.117,-2.497 2.496,-2.5c2.394,-0.004 4.979,-0.008 4.979,-0.008c0.828,-0.002 1.498,-0.675 1.497,-1.503c-0.001,-0.828 -0.675,-1.499 -1.503,-1.497Z" />
                <path d="M20.046,6.411l-6.845,6.846c-0.137,0.137 -0.232,0.311 -0.271,0.501l-1.081,5.152c-0.069,0.329 0.032,0.671 0.268,0.909c0.237,0.239 0.577,0.343 0.907,0.277l5.194,-1.038c0.193,-0.039 0.371,-0.134 0.511,-0.274l6.845,-6.845l-5.528,-5.528Zm1.415,-1.414l5.527,5.528l1.112,-1.111c1.526,-1.527 1.526,-4.001 -0,-5.527c-0.001,-0 -0.001,-0.001 -0.001,-0.001c-1.527,-1.526 -4.001,-1.526 -5.527,-0l-1.111,1.111Z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="flex items-center justify-center p-1.5 rounded-lg text-xs sm:text-sm font-medium focus:outline-none transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--error)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              aria-label="Delete post"
            >
              <svg
                fill="currentColor"
                height="16"
                width="16"
                viewBox="0 -0.5 21 21"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:h-[18px] sm:w-[18px]"
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
