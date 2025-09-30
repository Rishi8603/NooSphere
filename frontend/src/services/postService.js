import axios from "axios";

const API_URL='http://localhost:5000/api/posts'

export const getPosts = async () => {
  try{
    console.log("Making API call to:", API_URL); 
    const response=await axios.get(API_URL);
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

    const response=await axios.post(API_URL,postData,config)
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
    const response = await axios.delete(`${API_URL}/${postId}`, config);
    return response.data;
  } catch (error){
    console.error("Error deleting post:", error);
    throw error;
  }
};
