import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getPosts = async () => {
  try{
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.get(`${API_BASE_URL}/posts`, config);

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

export const toggleLike = async (postId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No auth token found. Please log in.");
  }
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  return axios.post(`${API_BASE_URL}/posts/${postId}/like`, {}, config);
}

export const getPostById = async (postId) => {
  const token = localStorage.getItem('token');
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  const response = await axios.get(`${API_BASE_URL}/posts/${postId}`, config);
  return response.data;
};

export const getComments = async (postId) => {
  const token = localStorage.getItem('token');
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  const response = await axios.get(`${API_BASE_URL}/posts/${postId}/comment`, config);
  return response.data; 
}


export const addComment = async (postId, commentText) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No auth token found. Please log in.");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(
    `${API_BASE_URL}/posts/${postId}/comment`,
    { text: commentText },
    config
  );
  return response.data; 
};

export const deleteComment = async (postId, commentId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No auth token found. Please log in.");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const response = await axios.delete(
    `${API_BASE_URL}/posts/${postId}/comment/${commentId}`,
    config
  );
  return response.data; // { success, message, commentId }
};
