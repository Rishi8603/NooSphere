import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import {getUserPosts} from '../services/postService';
import { getUserProfile, updateMe } from '../services/userService';

const UserProfile = () => {
  const {userId}=useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts,setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState(userInfo?.name || "");
  const [editBio, setEditBio] = useState(userInfo?.bio || "No bio yet");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


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
  const fetchProfileData = async () => {
    try {
      const userData = await getUserProfile(userId);
      console.log(userId);
      setUserInfo(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUserInfo({});
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchPostsData();
  }, [userId]);

  useEffect(() => {
    if (showModal && userInfo) {
      setEditName(userInfo.name);
      setEditBio(userInfo.bio || "");
    }
  }, [showModal, userInfo]);


  if (userInfo === null) {
    return <Spinner />;
  }

  if (!userInfo.name) {
    return <div className="text-center mt-8">User not found.</div>;
  }
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateMe({ name: editName, bio: editBio });
      await fetchProfileData();
      setShowModal(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000); 
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{userInfo.name}'s Profile</h1>
        {userInfo.bio && (
          <p className="text-lg text-gray-500 mb-4">{userInfo.bio}</p>
        )}
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>

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
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
              <form onSubmit={handleEdit} className="space-y-4">
                <label>
                  Name:
                  <input
                    className="border p-2 rounded w-full mt-1"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Bio:
                  <textarea
                    className="border p-2 rounded w-full mt-1"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                  />
                </label>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}

                <button
                  type="submit"
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </form>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 cursor-pointer"
              >×</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default UserProfile;