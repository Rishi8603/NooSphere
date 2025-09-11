import React,{useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import jwtDecode from 'jwt-decode'

const Dashboard=()=>{
  const[user,setUser]=useState(null);
  const navigate=useNavigate();

  useEffect(()=>{
    //token check
    const token=localStorage.getItem("token")
    if(!token){
      navigate('/login');
      return;
    }

    try{
      //decoding token and fetching user info
      const decoded=jwtDecode(token)
      setUser(decoded);
    }catch(err){
      console.error("Invalid token", err);
      localStorage.removeItem("token")
      navigate("/login")
    }
  },[navigate]);

  const handleLogout=()=>{
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-3xl mb-4">Dashboard</h1>
      {user ? (
        <>
          <p className="mb-2">Welcome, {user.username || user.email} 👋</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;