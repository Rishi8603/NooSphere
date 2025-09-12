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