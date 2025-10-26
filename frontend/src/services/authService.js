import api from './api';

export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
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
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token); // Save token in browser
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      const msg =
        error.response.data?.message ||
        error.response.data?.error ||
        "Login failed";
      throw new Error(msg);
    } else if (error.request) {
      throw new Error("Cannot connect to the server. Please check your connection.");
    } else {
      throw new Error(error.message);
    }
  }
};