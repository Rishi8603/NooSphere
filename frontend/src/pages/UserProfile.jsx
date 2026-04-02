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

  const isOwnProfile = currentUser?.id === userId;

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

  useEffect(() => {
    if (showModal && userInfo) {
      setEditName(userInfo.name);
      setEditBio(userInfo.bio);
    }
  }, [showModal, userInfo]);

  if (userInfo === null) return <Spinner />;
  if (!userInfo.name) return <div className="text-center mt-8" style={{ color: 'var(--text-muted)' }}>User not found.</div>;

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
          <div className="auth-success mb-4">{success}</div>
        )}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1">
            <img
              src={userInfo.photo || `https://ui-avatars.com/api/?name=${userInfo.name}&background=222&color=888`}
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full object-cover"
              style={{ border: '3px solid var(--border-color)' }}
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{userInfo.name}</h1>
              {userInfo.bio && <p className="text-base mt-1" style={{ color: 'var(--text-secondary)' }}>{userInfo.bio}</p>}
              <div className="mt-3 flex gap-6 text-sm justify-center sm:justify-start" style={{ color: 'var(--text-secondary)' }}>
                <Link to={`/user/${userId}/followers?tab=followers`} className="hover:underline">
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{followers.length}</span> Followers
                </Link>
                <Link to={`/user/${userId}/following?tab=following`} className="hover:underline">
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{following.length}</span> Following
                </Link>
              </div>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end sm:mt-8">
            {!isOwnProfile ? (
              isFollowing ? (
                <button className="btn-ghost" onClick={handleUnfollow}>
                  Unfollow
                </button>
              ) : (
                <button className="btn-primary" onClick={handleFollow}>
                  Follow
                </button>
              )
            ) : (
              <button onClick={() => setShowModal(true)} className="btn-ghost">
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-color)' }} className="mb-6" />
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Posts by {userInfo.name}</h2>
        <div className="flex flex-col gap-4">
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <div
                key={post.id}
                className="dark-card cursor-pointer transition-all duration-200"
                onClick={() => navigate(`/posts/${post._id}`)}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3a3a3a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{post.headline}</h3>
                <p className="mb-3 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>{post.text}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="dark-tag">{tag}</span>
                  ))}
                </div>
                {post.fileUrl && (
                  <a
                    href={post.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-accent text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Material ↗
                  </a>
                )}
                <small className="block mt-3 text-right text-xs" style={{ color: 'var(--text-muted)' }}>
                  Posted on {new Date(post.date).toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>This user hasn't posted any materials yet</p>
          )}
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Edit Profile</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <label className="block">
                <span className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Name</span>
                <input
                  className="dark-input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Bio</span>
                <textarea
                  className="dark-input"
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </label>
              <label className="block">
                <span className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Profile Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm"
                  style={{ color: 'var(--text-muted)' }}
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
                  style={{ border: '2px solid var(--border-color)' }}
                />
              )}
              {error && <p className="text-sm" style={{ color: 'var(--error)' }}>{error}</p>}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="btn-primary flex-1"
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
                  className="btn-ghost flex-1 sm:flex-initial"
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