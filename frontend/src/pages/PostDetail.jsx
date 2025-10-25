import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPostById, getComments, addComment, deleteComment } from "../services/postService";
import { AuthContext } from "../context/AuthContext";

const PostDetail = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPostById(postId).then((data) => setPost(data));
    getComments(postId).then((data) => setComments(data.comments));
    setLoading(false);
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // khaali mat bhej

    setAdding(true);
    try {
      await addComment(postId, newComment);
      setNewComment(""); // input field empty
      // Turant naye comments bhi fetch karo
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

      <div className="bg-white rounded-lg shadow p-4 mb-6">
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
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Comments</h3>
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-sm sm:text-base">no comments yet!</div>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="border-b pb-2">
                <div className="flex items-start gap-2">
                  {/* Profile Photo & User Link */}
                  <Link to={`/user/${comment.user?._id || comment.user}`} className="flex-shrink-0">
                    <img
                      src={
                        comment.user?.photo ||
                        `https://ui-avatars.com/api/?name=${comment.user?.name || "User"}`
                      }
                      alt={comment.user?.name || "User"}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  </Link>

                  {/* Name & Comment Text */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/user/${comment.user?._id || comment.user}`}
                      className="font-semibold hover:underline text-sm sm:text-base"
                    >
                      {comment.user?.name || "Unknown"}
                    </Link>
                    <div className="text-gray-700 text-sm sm:text-base break-words">{comment.text}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Delete Button */}
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

        {/* Comment Form - Responsive */}
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
}

export default PostDetail;