import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Feed from './Feed';
import CreatePost from '../components/CreatePost';
import { getPosts, deletePost, createPost, updatePost } from '../services/postService'; 

const Homepage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleUpdatePost = async (postId, updatedData) => {
    try {
      const { post } = await updatePost(postId, updatedData);
      // Find the post in the current state and replace it with the updated version
      setPosts(posts.map(p => (p._id === postId ? post : p)));
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 border-r bg-white flex-shrink-0">
        <Sidebar />
      </div>

      <div className="w-3/4 flex flex-col">
        <div className="p-2 border-b flex-shrink-0">
          <CreatePost onPostCreated={fetchPosts} />
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          <Feed posts={posts} loading={loading} onDelete={handleDeletePost} onUpdate={handleUpdatePost} />
        </div>
      </div>
    </div>
  );
};

export default Homepage;