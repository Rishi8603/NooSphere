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

  // AI summary state
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPostById(postId).then((data) => setPost(data));
    getComments(postId).then((data) => setComments(data.comments));
    setLoading(false);
    // Reset summary when navigating to a different post
    setSummary("");
    setShowSummary(false);
    setSummaryError("");
  }, [postId]);

  const handleSummarize = async () => {
    if (summary) {
      // Toggle visibility if already fetched
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

  if (loading || !post) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          marginBottom: "16px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "14px",
          color: "#333",
          transition: "all 0.2s",
          fontWeight: "500"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f5f5f5";
          e.currentTarget.style.borderColor = "black";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "white";
          e.currentTarget.style.borderColor = "#e0e0e0";
        }}
      >
        <span style={{ marginRight: "6px", fontSize: "18px" }}>←</span>
        Back
      </button>

      {/* Post card */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-1 break-words">{post.headline}</h2>
        <div className="text-sm sm:text-base text-gray-600 mb-2">By: {post.user?.name || "Unknown"}</div>
        <div className="mb-2 text-sm sm:text-base break-words">{post.text}</div>
        <div className="mt-2">
          <a href={post.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm sm:text-base">
            View Material
          </a>
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold text-gray-700">
              #{tag}
            </span>
          ))}
        </div>

        {/*  AI Summarize Button  */}
        <div className="mt-4 border-t pt-4">
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
                {/* Sparkle icon */}
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
            <p className="mt-2 text-red-500 text-sm">{summaryError}</p>
          )}

          {/* Summary panel */}
          {showSummary && summary && (
            <div className="mt-3 p-4 rounded-lg border border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
                </svg>
                <span className="text-sm font-semibold text-purple-700">AI Summary</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {summary}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Comments</h3>
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-sm sm:text-base">no comments yet!</div>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="border-b pb-2">
                <div className="flex items-start gap-2">
                  <Link to={`/user/${comment.user?._id || comment.user}`} className="flex-shrink-0">
                    <img
                      src={comment.user?.photo || `https://ui-avatars.com/api/?name=${comment.user?.name || "User"}`}
                      alt={comment.user?.name || "User"}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/user/${comment.user?._id || comment.user}`} className="font-semibold hover:underline text-sm sm:text-base">
                      {comment.user?.name || "Unknown"}
                    </Link>
                    <div className="text-gray-700 text-sm sm:text-base break-words">{comment.text}</div>
                    <div className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</div>
                  </div>
                  {user?.id === comment.user?._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 flex-shrink-0"
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
            placeholder="comment ..."
            className="flex-1 border px-3 py-2 rounded sm:rounded-l sm:rounded-r-none focus:outline-none text-sm sm:text-base"
            disabled={adding}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded sm:rounded-l-none sm:rounded-r disabled:bg-blue-300 text-sm sm:text-base whitespace-nowrap"
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
