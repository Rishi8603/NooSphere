import api from './api';

export const followUser = async (userId) => {
  try {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}/unfollow`);
    return response.data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};

export const getFollowers = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data.followers;
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
};

export const getFollowing = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/following`);
    return response.data.following;
  } catch (error) {
    console.error("Error fetching following:", error);
    throw error;
  }
};