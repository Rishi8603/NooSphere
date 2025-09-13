import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Feed from './Feed';
import CreatePost from '../components/CreatePost';
import { getPosts } from '../services/postService'; 

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

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 border-r bg-white flex-shrink-0">
        <Sidebar />
      </div>

      <div className="w-3/4 flex flex-col">
        <div className="p-4 border-b ">
          <CreatePost onPostCreated={fetchPosts} />
        </div>

        <div className="p-4">
          <Feed posts={posts} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Homepage;