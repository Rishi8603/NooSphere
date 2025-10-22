import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const deleteAccount = async () => {
  const token = localStorage.getItem("token");
  return axios.delete(`${API_BASE_URL}/users/delete`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
