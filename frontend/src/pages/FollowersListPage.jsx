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
    // navigate instead of Link to ensure proper routing
    navigate(`/user/${targetUserId}`, {
      replace: false,
      state: { from: 'followers-page' }
    });
  };

  if (error) {
    return (
      <div style={{
        maxWidth: "600px",
        margin: "80px auto 20px",
        padding: "20px",
        textAlign: "center"
      }}>
        <p style={{ color: "#dc3545", fontSize: "18px" }}>{error}</p>
        <button
          onClick={() => navigate('/login')}
          style={{
            marginTop: "16px",
            padding: "10px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          marginBottom: "16px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "14px",
          color: "#333",
          transition: "all 0.2s",
          fontWeight: "500"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f5f5f5";
          e.currentTarget.style.borderColor = "black";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "white";
          e.currentTarget.style.borderColor = "#e0e0e0";
        }}
      >
        <span style={{ marginRight: "6px", fontSize: "18px" }}>←</span>
        Back to Profile
      </button>

      {/* Profile Owner Header Section */}
      {profileOwner && (
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          marginBottom: "24px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          cursor: "pointer"
        }}
          onClick={(e) => handleProfileClick(e, userId)}
        >
          <img
            src={profileOwner.photo || profileOwner.profilePic || `https://ui-avatars.com/api/?name=${profileOwner.name}`}
            alt={profileOwner.name}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "16px",
              border: "3px solid"
            }}
          />
          <div>
            <h2 style={{
              margin: "0 0 4px 0",
              fontSize: "24px",
              color: "#333"
            }}>
              {profileOwner.name}
            </h2>
          </div>
        </div>
      )}

      {/* Tab Buttons */}
      <div style={{
        display: "flex",
        borderBottom: "2px solid #e0e0e0",
        marginBottom: "20px"
      }}>
        <button
          onClick={() => setTab("followers")}
          style={{
            flex: 1,
            padding: "12px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: tab === "followers" ? "bold" : "normal",
            color: tab === "followers" ? "#007bff" : "#666",
            borderBottom: tab === "followers" ? "3px solid #007bff" : "none"
          }}
        >
          Followers ({followers.length})
        </button>
        <button
          onClick={() => setTab("following")}
          style={{
            flex: 1,
            padding: "12px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: tab === "following" ? "bold" : "normal",
            color: tab === "following" ? "#007bff" : "#666",
            borderBottom: tab === "following" ? "3px solid #007bff" : "none"
          }}
        >
          Following ({following.length})
        </button>
      </div>

      {/* Loading State */}
      {loading && <p style={{ textAlign: "center", color: "#666" }}>Loading...</p>}

      {/* User Lists */}
      {!loading && (
        <div>
          {tab === "followers" && (
            <div>
              {followers.length === 0 ? (
                <p style={{ textAlign: "center", color: "#999" }}>No followers yet</p>
              ) : (
                followers.map(user => (
                  <div
                    key={user._id}
                    onClick={(e) => handleProfileClick(e, user._id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <img
                      src={user.photo || user.profilePic || `https://ui-avatars.com/api/?name=${user.name}`}
                      alt={user.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "12px"
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: "500", fontSize: "16px" }}>{user.name}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "following" && (
            <div>
              {following.length === 0 ? (
                <p style={{ textAlign: "center", color: "#999" }}>Not following anyone yet</p>
              ) : (
                following.map(user => (
                  <div
                    key={user._id}
                    onClick={(e) => handleProfileClick(e, user._id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <img
                      src={user.photo || user.profilePic || `https://ui-avatars.com/api/?name=${user.name}`}
                      alt={user.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "12px"
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: "500", fontSize: "16px" }}>{user.name}</div>
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