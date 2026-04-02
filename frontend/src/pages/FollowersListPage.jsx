import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { getFollowers, getFollowing } from "../services/actions";
import { getUserProfile } from "../services/userService";

const FollowersFollowingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "following" ? "following" : "followers";
  const [tab, setTab] = useState(initialTab);
  const { userId } = useParams();

  const [profileOwner, setProfileOwner] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchLists = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setError("Please log in to view this page");
          setLoading(false);
          return;
        }

        const [followersData, followingData, ownerData] = await Promise.all([
          getFollowers(userId),
          getFollowing(userId),
          getUserProfile(userId),
        ]);

        setFollowers(followersData || []);
        setFollowing(followingData || []);
        setProfileOwner(ownerData);
      } catch (e) {
        console.error("Error fetching data:", e);
        setFollowers([]);
        setFollowing([]);
        setProfileOwner(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [userId]);

  const handleProfileClick = (e, targetUserId) => {
    e.preventDefault();
    navigate(`/user/${targetUserId}`, {
      replace: false,
      state: { from: 'followers-page' }
    });
  };

  if (error) {
    return (
      <div style={{ maxWidth: "600px", margin: "80px auto 20px", padding: "20px", textAlign: "center" }}>
        <p style={{ color: "var(--error)", fontSize: "18px" }}>{error}</p>
        <button onClick={() => navigate('/login')} className="btn-primary" style={{ marginTop: '16px' }}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="back-btn">
        <span style={{ fontSize: '18px' }}>←</span>
        Back to Profile
      </button>

      {profileOwner && (
        <div
          className="dark-card flex items-center mb-6 cursor-pointer transition-all duration-200"
          onClick={(e) => handleProfileClick(e, userId)}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3a3a3a'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
        >
          <img
            src={profileOwner.photo || profileOwner.profilePic || `https://ui-avatars.com/api/?name=${profileOwner.name}&background=222&color=888`}
            alt={profileOwner.name}
            className="rounded-full object-cover mr-4"
            style={{ width: '72px', height: '72px', border: '3px solid var(--border-color)' }}
          />
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {profileOwner.name}
            </h2>
          </div>
        </div>
      )}

      <div className="flex mb-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setTab("followers")}
          className="flex-1 py-3 text-sm font-medium transition-colors duration-150"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: tab === "followers" ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: tab === "followers" ? '2px solid var(--accent)' : '2px solid transparent',
            fontFamily: 'inherit',
          }}
        >
          Followers ({followers.length})
        </button>
        <button
          onClick={() => setTab("following")}
          className="flex-1 py-3 text-sm font-medium transition-colors duration-150"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: tab === "following" ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: tab === "following" ? '2px solid var(--accent)' : '2px solid transparent',
            fontFamily: 'inherit',
          }}
        >
          Following ({following.length})
        </button>
      </div>

      {loading && <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading...</p>}

      {!loading && (
        <div>
          {tab === "followers" && (
            <div>
              {followers.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--text-muted)" }}>No followers yet</p>
              ) : (
                followers.map(user => (
                  <div
                    key={user._id}
                    onClick={(e) => handleProfileClick(e, user._id)}
                    className="flex items-center py-3 px-2 cursor-pointer rounded-lg transition-colors duration-150"
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <img
                      src={user.photo || user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=222&color=888`}
                      alt={user.name}
                      className="rounded-full object-cover mr-3"
                      style={{ width: '44px', height: '44px', border: '2px solid var(--border-color)' }}
                    />
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "following" && (
            <div>
              {following.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Not following anyone yet</p>
              ) : (
                following.map(user => (
                  <div
                    key={user._id}
                    onClick={(e) => handleProfileClick(e, user._id)}
                    className="flex items-center py-3 px-2 cursor-pointer rounded-lg transition-colors duration-150"
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <img
                      src={user.photo || user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=222&color=888`}
                      alt={user.name}
                      className="rounded-full object-cover mr-3"
                      style={{ width: '44px', height: '44px', border: '2px solid var(--border-color)' }}
                    />
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FollowersFollowingPage;