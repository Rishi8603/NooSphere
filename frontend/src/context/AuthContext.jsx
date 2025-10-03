import React,{createContext,useState,useEffect, Children} from 'react'
import {jwtDecode} from 'jwt-decode'

export const AuthContext=createContext();

export const AuthProvider=({children})=>{
  const[user,setUser]=useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    setTimeout(() => {
      if (token) {
        const decoded = jwtDecode(token);
        setUser(decoded.user);
      }
      setLoading(false);
    }, 800); // 1 second delay
  }, []);

  const logout=()=>{
    localStorage.removeItem("token")
    setUser(null);
  }
  return(
    <AuthContext.Provider value={{user,setUser,logout,loading}}>
      {children}
    </AuthContext.Provider>
  );
};