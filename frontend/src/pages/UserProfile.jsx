import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import { getUserPosts } from '../services/postService';
import { getUserProfile, updateMe } from '../services/userService';
import { AuthContext } from '../context/AuthContext';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editPhoto, setEditPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");

  // Check if this is the current user's profile
  const isOwnProfile = currentUser && currentUser.id === userId;

  const fetchPostsData = async () => {
    try {
      const postsData = await getUserPosts(userId);
      setUserPosts(postsData);
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
      setUserPosts([]);
    }
  };

  const fetchProfileData = async () => {
    try {
      const userData = await getUserProfile(userId);
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
      setEditName(userInfo.name || "");
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
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append('name', editName);
      formData.append('bio', editBio);
      if (editPhoto) formData.append('photo', editPhoto);

      const updatedUser = await updateMe(formData);

      // Update local state with the response
      setUserInfo(updatedUser);
      setShowModal(false);
      setEditPhoto(null);
      setPreviewPhoto("");
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Update error:', err);
      if (err.response?.data?.error) setError(err.response.data.error);
      else setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="flex items-center gap-4 mb-4">
          <img
            src={userInfo.photo || "https://ui-avatars.com/api/?name=" + userInfo.name}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <div>
            <h1 className="text-2xl font-bold">{userInfo.name}</h1>
            {userInfo.bio && (
              <p className="text-lg text-gray-500">{userInfo.bio}</p>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-4"
          >
            Edit Profile
          </button>
        )}

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
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
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
              <label>
                Profile Picture:
                <input
                  type="file"
                  accept="image/*"
                  className="w-full mt-1"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    setEditPhoto(file);
                    if (file) {
                      setPreviewPhoto(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
              {previewPhoto && (
                <img
                  src={previewPhoto}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover mx-auto"
                />
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditPhoto(null);
                    setPreviewPhoto("");
                    setError("");
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;