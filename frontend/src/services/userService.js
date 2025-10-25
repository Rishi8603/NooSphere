import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserProfile = async (userId) => {
  try {
    const token = localStorage.getItem('token'); 
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; 

    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, config); 
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
  const response = await axios.put(`${API_BASE_URL}/users/me`, data, config);
  return response.data;
};
