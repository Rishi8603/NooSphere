import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { getPostById, getComments, addComment, deleteComment } from "../services/postService";
import { AuthContext } from "../context/AuthContext";

const PostDetail =()=>{
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
  return(
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-2xl font-bold mb-1">{post.headline}</h2>
        <div className="text-gray-600 mb-2">By: {post.user?.name || "Unknown"}</div>
        <div className="mb-2">{post.text}</div>
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
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div>Koi comment nahi hai!</div>
          ) : (
              comments.map(comment => (
                <div key={comment._id} className="border-b pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Profile Photo & User Link */}
                    <Link to={`/user/${comment.user?._id || comment.user}`}>
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
                    <div>
                      <Link
                        to={`/user/${comment.user?._id || comment.user}`}
                        className="font-semibold hover:underline"
                      >
                        {comment.user?.name || "Unknown"}
                      </Link>
                      <div className="text-gray-700">{comment.text}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {user?.id === comment.user?._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="px-2 py-1 ml-2 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
          )}
        </div>
        <form className="mt-6 flex gap-2" onSubmit={handleCommentSubmit}>
          <input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="comment ..."
            className="flex-1 border px-3 py-2 rounded-l focus:outline-none"
            disabled={adding}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r disabled:bg-blue-300"
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