import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { getUserPosts } from "../services/postService";
import { getUserProfile, updateMe } from "../services/userService";
import { AuthContext } from "../context/AuthContext";
import { followUser, unfollowUser, getFollowers, getFollowing } from "../services/actions";

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPhoto, setEditPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Are we viewing our own profile?
  const isOwnProfile = currentUser?.id === userId;

  // Fetch user profile and posts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = await getUserProfile(userId);
        setUserInfo(userData);
      } catch (error) {
        setUserInfo(null);
      }
    };

    const fetchPostsData = async () => {
      try {
        const postsData = await getUserPosts(userId);
        setUserPosts(postsData);
      } catch (error) {
        setUserPosts([]);
      }
    };

    // Followers / Following List + Follow Button status
    const fetchFollowData = async () => {
      try {
        const followersList = await getFollowers(userId);
        setFollowers(followersList);
        setIsFollowing(followersList.some(u => u._id === currentUser?.id));
        const followingList = await getFollowing(userId);
        setFollowing(followingList);
      } catch {
        setFollowers([]);
        setFollowing([]);
      }
    };

    fetchProfileData();
    fetchPostsData();
    fetchFollowData();
  }, [userId, currentUser?.id]);

  // Show edit modal prefill
  useEffect(() => {
    if (showModal && userInfo) {
      setEditName(userInfo.name);
      setEditBio(userInfo.bio);
    }
  }, [showModal, userInfo]);

  if (userInfo === null) return <Spinner />;
  if (!userInfo.name) return <div className="text-center mt-8">User not found.</div>;

  // Handle profile edit
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("bio", editBio);
      if (editPhoto) formData.append("photo", editPhoto);

      const updatedUser = await updateMe(formData);

      setUserInfo(updatedUser);
      setShowModal(false);
      setEditPhoto(null);
      setPreviewPhoto("");
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err.response?.data?.error) setError(err.response.data.error);
      else setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Follow/Unfollow logic
  const token = localStorage.getItem("token");

  const handleFollow = async () => {
    try {
      await followUser(userId, token);
      setIsFollowing(true);
      const updatedFollowers = await getFollowers(userId);
      setFollowers(updatedFollowers);
    } catch (err) {
      alert(err?.response?.data?.message || "Error following user");
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(userId, token);
      setIsFollowing(false);
      const updatedFollowers = await getFollowers(userId);
      setFollowers(updatedFollowers);
    } catch (err) {
      alert(err?.response?.data?.message || "Error unfollowing user");
    }
  };

  return (
    <div className="flex flex-col gap-3 max-w-2xl mx-auto px-4 py-8">
      <div>
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
        )}
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          {/* Left side: profile picture + info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1">
            <img
              src={userInfo.photo || `https://ui-avatars.com/api/?name=${userInfo.name}`}
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">{userInfo.name}</h1>
              {userInfo.bio && <p className="text-lg text-gray-500">{userInfo.bio}</p>}
              <div className="mt-2 flex gap-6 text-sm justify-center sm:justify-start">
                <Link to={`/user/${userId}/followers?tab=followers`}>
                  <span className="font-bold hover:underline">{followers.length}</span> Followers
                </Link>
                <Link to={`/user/${userId}/following?tab=following`}>
                  <span className="font-bold hover:underline">{following.length}</span> Following
                </Link>
              </div>
            </div>
          </div>

          {/* Right side: action button */}
          <div className="flex justify-center sm:justify-end sm:mt-8">
            {!isOwnProfile ? (
              isFollowing ? (
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  onClick={handleUnfollow}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleFollow}
                >
                  Follow
                </button>
              )
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <hr className="mb-6" />
        <h2 className="text-2xl font-semibold mb-4">Posts by {userInfo.name}</h2>
        <div className="flex flex-col gap-6">
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => navigate(`/posts/${post._id}`)}
              >
                <h3 className="text-lg sm:text-xl font-bold mb-2">{post.headline}</h3>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">{post.text}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                {post.fileUrl && (
                  <a
                    href={post.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-sm sm:text-base"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Material
                  </a>
                )}
                <small className="block text-gray-500 mt-4 text-right text-xs sm:text-sm">
                  Posted on {new Date(post.date).toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            <p>This user hasn't posted any materials yet</p>
          )}
        </div>
      </div>
      {/* Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <label className="block">
                <span className="block mb-1">Name</span>
                <input
                  className="border p-2 rounded w-full"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="block mb-1">Bio</span>
                <textarea
                  className="border p-2 rounded w-full"
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  rows={3}
                />
              </label>
              <label className="block">
                <span className="block mb-1">Profile Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    setEditPhoto(file);
                    if (file) setPreviewPhoto(URL.createObjectURL(file));
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
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
                  disabled={loading}
                  style={loading ? { opacity: 0.5, cursor: "not-allowed" } : {}}
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
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex-1 sm:flex-initial"
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