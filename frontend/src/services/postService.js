import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getPosts = async () => {
  try{
    console.log("Making API call to:", API_BASE_URL); 
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
  }catch(error){
    console.error("Error fetching posts:",error);
    throw error;
  }
};

export const createPost=async(postData)=>{
  try{
    // Get the token from local storage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No auth token found. Please log in.");
    }

    const config={
      headers:{
        'Authorization':`Bearer ${token}`,
      },
    };

    const response = await axios.post(`${API_BASE_URL}/posts`,postData,config)
    return response.data
  }catch(error){
    console.error("error creating post", error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No auth token found. Please log in.");
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    // Send a DELETE request to the specific post's URL
    const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`
, config);
    return response.data;
  } catch (error){
    console.error("Error deleting post:", error);
    throw error;
  }
};
export const updatePost = async (postId, updatedData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No auth token found. Please log in.");
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    // Send a PUT request with the updated data
    const response = await axios.put(`${API_BASE_URL}/posts/${postId}`, updatedData, config);
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const getUserPosts=async(userId)=>{
  const response = await axios.get(`${API_BASE_URL}/posts/user/${userId}`);
  return response.data;
};