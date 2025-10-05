import axios from 'axios';

const API_URL = '/api/upload';

export const uploadFile = async (file) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No auth token found. Please log in.");
    }

    const formData = new FormData();
    formData.append('file', file); 

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios.post(API_URL, formData, config);

    return response.data.url;

  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};