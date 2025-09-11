import axios from 'axios';


const API_URL = 'http://localhost:5000/api/auth';  // Backend base URL

export const Signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/Signup`, userData);
    return response.data;  // { token, user }
  } catch (error) {
    throw error.response.data;  // pass error back to component
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);  // Save token in browser
    }
    return response.data;  // { token, user }
  } catch (error) {
    throw error.response.data;
  }
};