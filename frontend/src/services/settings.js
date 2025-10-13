import axios from 'axios';

export const deleteAccount = async () => {
  return axios.delete('/api/user/delete', { withCredentials: true });
};
