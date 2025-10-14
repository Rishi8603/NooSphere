import axios from 'axios';

export const deleteAccount = async () => {
  const token = localStorage.getItem("token"); 
  return axios.delete('/api/users/delete', {
    headers: { Authorization: `Bearer ${token}` }
  });
};
