import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    return response.data; 
  } catch (error) {
    if (error.response) {
      const msg =
        error.response.data?.message ||
        error.response.data?.error ||
        "Signup failed";
      throw new Error(msg);
    } else if (error.request) {
      throw new Error("Cannot connect to the server. Please check your connection.");
    } else {
      throw new Error(error.message);
    }
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);  // Save token in browser
    }
    return response.data;  
  } catch (error) {
    if (error.response) {
      const msg =
        error.response.data?.message ||
        error.response.data?.error ||
        "Login failed";
      throw new Error(msg);
    }
  }
};

