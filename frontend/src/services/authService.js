import axios from 'axios';


const API_URL = '/api/auth';  // Backend base URL

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;  // { token, user }
  } catch (error) {
    // Check if the error has a response from the server
    if (error.response) {
      // The server responded with a status code that falls out of the range of 2xx
      throw error.response.data;
    } else if (error.request) {
      // The request was made but no response was received (e.g., server is down)
      throw new Error("Cannot connect to the server. Please check your connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message);
    }
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
    // Check if the error has a response from the server
    if (error.response) {
      // The server responded with a status code that falls out of the range of 2xx
      throw error.response.data;
    } else if (error.request) {
      // The request was made but no response was received (e.g., server is down)
      throw new Error("Cannot connect to the server. Please check your connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message);
    }
  }
};

