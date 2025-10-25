import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const followUser = async (userId, token) => {
  return axios.post(
    `${API_BASE_URL}/users/${userId}/follow`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const unfollowUser = async (userId, token) => {
  return axios.delete(`${API_BASE_URL}/users/${userId}/unfollow`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getFollowers = async (userId) => {
  return axios
    .get(`${API_BASE_URL}/users/${userId}/followers`)
    .then((res) => res.data.followers);
};

export const getFollowing = async (userId) => {
  return axios
    .get(`${API_BASE_URL}/users/${userId}/following`)
    .then((res) => res.data.following);
};
