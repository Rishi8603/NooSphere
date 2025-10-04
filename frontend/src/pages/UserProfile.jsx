import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import {getUserPosts} from '../services/postService';
import { getUserProfile } from '../services/userService';

const UserProfile = () => {
  const {userId}=useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts,setUserPosts] = useState([]);

  useEffect(() => {//Fetch user posts using postService
    setUserInfo(null);

    const fetchProfileData = async () => {
      try {
        const userData = await getUserProfile(userId);
        setUserInfo(userData);
        console.log(userData);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUserInfo({});
      }
    };

    const fetchPostsData = async () => {
      try {
        const postsData = await getUserPosts(userId);
        setUserPosts(postsData);
        console.log(postsData);
      } catch (error) {
        console.error('Failed to fetch user posts:', error);
        setUserPosts([]);
      }
    };

    fetchProfileData();
    fetchPostsData();
  }, [userId]);//dependency array ensure this run when userid changes

  if (userInfo === null) {
    return <Spinner />;
  }

  if (!userInfo.name) {
    return <div className="text-center mt-8">User not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{userInfo.name}'s Profile</h1>
      <hr className="mb-6" />
      <h2 className="text-2xl font-semibold mb-4">Posts by {userInfo.name}:</h2>

      <div className="flex flex-col gap-6">
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold mb-2">{post.headline}</h3>
              <p className="text-gray-700 mb-4">{post.text}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <a
                href={post.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                View Material
              </a>
              <small className="block text-gray-500 mt-4 text-right">
                Posted on {new Date(post.date).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p>This user hasn't posted any materials yet</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;