import React from 'react';

const Feed = ({ posts, loading }) => {

  if (loading) return <p>Loading posts...</p>;

  if (posts.length === 0) {
    return <p>No posts yet. Be the first to create one!</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post._id} className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-2xl font-semibold">{post.headline}</h2>
          <p className="mt-2 text-gray-700">{post.text}</p>
          {/* We can add file links, tags, etc. here later */}
        </div>
      ))}
    </div>
  );
};

export default Feed;