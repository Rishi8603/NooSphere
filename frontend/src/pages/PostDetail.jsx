import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPostById, getComments, addComment, deleteComment } from "../services/postService";
import { summarizePost } from "../services/aiService";
import { AuthContext } from "../context/AuthContext";

const PostDetail = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [adding, setAdding] = useState(false);

  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPostById(postId).then((data) => {
      setPost(data);
      if (data.aiSummary) {
        setSummary(data.aiSummary);
        setShowSummary(true);
      } else {
        setSummary("");
        setShowSummary(false);
      }
    });
    getComments(postId).then((data) => setComments(data.comments));
    setLoading(false);
    setSummaryError("");
  }, [postId]);

  const handleSummarize = async () => {
    if (summary) {
      setShowSummary(prev => !prev);
      return;
    }
    setSummaryLoading(true);
    setSummaryError("");
    try {
      const result = await summarizePost({
        headline: post.headline,
        text: post.text,
        tags: post.tags,
        fileUrl: post.fileUrl,
      });
      setSummary(result);
      setShowSummary(true);
    } catch (err) {
      setSummaryError("Failed to generate summary. Please try again.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setAdding(true);
    try {
      await addComment(postId, newComment);
      setNewComment("");
      const data = await getComments(postId);
      setComments(data.comments);
    } catch (error) {
      alert("Comment add nahi hua! Try again.");
    }
    setAdding(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(postId, commentId);
      const data = await getComments(postId);
      setComments(data.comments);
    } catch (err) {
      alert("Comment not deleted! Try again.");
    }
  };

  if (loading || !post) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="back-btn">
        <span style={{ fontSize: '18px' }}>←</span>
        Back
      </button>

      <div className="dark-card mb-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-1 break-words" style={{ color: 'var(--text-primary)' }}>{post.headline}</h2>
        <div className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>By: {post.user?.name || "Unknown"}</div>
        <div className="mb-2 text-sm sm:text-base break-words" style={{ color: 'var(--text-secondary)' }}>{post.text}</div>
        <div className="mt-2">
          <a href={post.fileUrl} target="_blank" rel="noopener noreferrer" className="link-accent text-sm">
            View Material ↗
          </a>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {post.tags.map(tag => (
            <span key={tag} className="dark-tag">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={handleSummarize}
            disabled={summaryLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white",
            }}
          >
            {summaryLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Summarizing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
                  <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z" />
                  <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5z" />
                </svg>
                {showSummary ? "Hide Summary" : "AI Summary"}
              </>
            )}
          </button>

          {summaryError && (
            <p className="mt-2 text-sm" style={{ color: 'var(--error)' }}>{summaryError}</p>
          )}

          {showSummary && summary && (
            <div className="ai-summary-panel">
              <div className="label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
                  </svg>
                  <span>AI Summary</span>
                </div>
                <button 
                  onClick={() => setShowSummary(false)} 
                  title="Minimize Summary"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:text-white transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="content">
                {summary}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="dark-card">
        <h3 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Comments</h3>
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>no comments yet!</div>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div className="flex items-start gap-2.5">
                  <Link to={`/user/${comment.user?._id || comment.user}`} className="flex-shrink-0">
                    <img
                      src={comment.user?.photo || `https://ui-avatars.com/api/?name=${comment.user?.name || "User"}&background=222&color=888`}
                      alt={comment.user?.name || "User"}
                      className="w-8 h-8 rounded-full object-cover"
                      style={{ border: '2px solid var(--border-color)' }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/user/${comment.user?._id || comment.user}`} className="font-medium hover:underline text-sm" style={{ color: 'var(--text-primary)' }}>
                      {comment.user?.name || "Unknown"}
                    </Link>
                    <div className="text-sm break-words mt-0.5" style={{ color: 'var(--text-secondary)' }}>{comment.text}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{new Date(comment.createdAt).toLocaleString()}</div>
                  </div>
                  {user?.id === comment.user?._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="px-2.5 py-1 text-xs rounded-md flex-shrink-0 transition-colors duration-150"
                      style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--error)', border: '1px solid rgba(248,113,113,0.2)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <form className="mt-6 flex flex-col sm:flex-row gap-2" onSubmit={handleCommentSubmit}>
          <input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="dark-input flex-1"
            disabled={adding}
          />
          <button
            type="submit"
            className="btn-primary whitespace-nowrap"
            disabled={adding}
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostDetail;
