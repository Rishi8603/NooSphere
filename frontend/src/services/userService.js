import axios from 'axios';
const API_URL = '/api/users';

export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

export const updateMe = async (data) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { 'Authorization': `Bearer ${token}` }
  };
  const response = await axios.put(`${API_URL}/me`, data, config);
  return response.data;
};
