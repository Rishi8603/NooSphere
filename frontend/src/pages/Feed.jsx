import React,{useContext} from 'react';
import { AuthContext } from '../context/AuthContext';


const Feed = ({ posts, loading, onDelete }) => {
  const { user } = useContext(AuthContext);

  if (loading) return <p>Loading posts...</p>;
  if (posts.length === 0) {
    return <p>No posts yet. Be the first to create one!</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post._id} className="p-4 border rounded-lg shadow bg-white relative">

          {user && user.id === post.user._id && (
            <button
              onClick={() => onDelete(post._id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            >
              Delete
            </button>
          )}
          
          <h2 className="text-2xl font-semibold">{post.headline}</h2>

          <div className="text-sm text-gray-500 mt-1">
            {/* The ? in post.user?.name is called optional chaining..used as a safety measure*/}
            <span>Posted by: <strong>{post.user?.name || 'Unknown User'}</strong></span>
            <span className="mx-2">|</span>
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>

          <p className="mt-2 text-gray-700">{post.text}</p>

          <div className="mt-4">
            <a href={post.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View Material
            </a>
          </div>

          <div className="mt-2">
            {post.tags.map(tag => (
              <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                #{tag}
              </span>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
};

export default Feed;