import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getFollowers, getFollowing } from "../services/actions";

const FollowersFollowingPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "following" ? "following" : "followers";
  const [tab, setTab] = useState(initialTab);
  const { userId } = useParams();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchLists = async () => {
      try {
        const [followersData, followingData] = await Promise.all([
          getFollowers(userId),
          getFollowing(userId),
        ]);
        setFollowers(followersData);
        setFollowing(followingData);
      } catch (e) {
        setFollowers([]);
        setFollowing([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, [userId]);

  return (
    <div className="max-w-lg mx-auto mt-8">
      {/* Tabs (NO route change) */}
      <div className="flex border-b mb-6">
        <button
          className={`flex-1 py-2 text-lg font-semibold ${tab === "followers" ? "border-b-2 border-blue-500 text-blue-800" : "text-gray-600"
            }`}
          onClick={() => setTab("followers")}
        >
          Followers ({followers.length})
        </button>
        <button
          className={`flex-1 py-2 text-lg font-semibold ${tab === "following" ? "border-b-2 border-blue-500 text-blue-800" : "text-gray-600"
            }`}
          onClick={() => setTab("following")}
        >
          Following ({following.length})
        </button>
      </div>
      {/* Section Content */}
      {loading ? (
        <div className="text-gray-500 text-center py-8">Loading...</div>
      ) : tab === "followers" ? (
        <ul>
          {followers.length === 0 ? (
            <li>No followers found.</li>
          ) : (
            followers.map(u => (
              <li key={u.id} className="flex items-center gap-4 py-2 border-b">
                <img src={u.photo || "/default.png"} alt="profile" className="rounded-full w-10 h-10" />
                <div>
                  <div className="font-semibold">{u.name}</div>
                  {u.username && <div className="text-gray-500">@{u.username}</div>}
                </div>
              </li>
            ))
          )}
        </ul>
      ) : (
        <ul>
          {following.length === 0 ? (
            <li>No following found.</li>
          ) : (
            following.map(u => (
              <li key={u.id} className="flex items-center gap-4 py-2 border-b">
                <img src={u.photo || "/default.png"} alt="profile" className="rounded-full w-10 h-10" />
                <div>
                  <div className="font-semibold">{u.name}</div>
                  {u.username && <div className="text-gray-500">@{u.username}</div>}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default FollowersFollowingPage;
