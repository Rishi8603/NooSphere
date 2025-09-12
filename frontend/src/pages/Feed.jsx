import React,{useState,useEffect} from "react";
import { getPosts } from "../services/postService";

const Feed=()=>{ 
  const [posts,setPosts]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  useEffect(()=>{
    console.log("Feed component has mounted. Fetching posts..."); 
    const fetchPosts=async()=>{
      try{
        const data=await getPosts();
        setPosts(data);
      }catch(error){
        setError("Failed to load posts.")
      }finally{
        setLoading(false);
      };
    }

    fetchPosts();
  },[]);

  if(loading) return <p>Loading posts...</p>
  if(error) return <p>{error}</p>

  return (
    <div className="p-4 bg-black text-white w-screen h-screen">
      <h1 className="text-3xl font-bold mb-4">Digital Notes Feed</h1>

      <div className="space-y-4">
        {posts.map(post => ( // Use parentheses instead of curly braces
          <div key={post._id} className="p-4 border rounded-lg shadow">
            <h2 className="text-2xl font-semibold">{post.headline}</h2>
            <p className="mt-2">{post.text}</p> {/* Fix the typo here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;