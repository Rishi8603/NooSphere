
import axios from 'axios';

export const followUser = async (userId, token) => {
  return axios.post(`/api/users/${userId}/follow`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const unfollowUser = async (userId, token) => {
  return axios.delete(`/api/users/${userId}/unfollow`, { headers: { Authorization: `Bearer ${token}` } });
};

export const getFollowers = async (userId) =>
  axios.get(`/api/users/${userId}/followers`).then(res => res.data.followers);

export const getFollowing = async (userId) =>
  axios.get(`/api/users/${userId}/following`).then(res => res.data.following);
