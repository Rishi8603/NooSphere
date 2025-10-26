import api from './api';

export const deleteAccount = async () => {
  try {
    const response = await api.delete('/users/delete');
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};