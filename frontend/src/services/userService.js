// frontend/src/services/userService.js
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