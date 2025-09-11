import React,{createContext,useState,useEffect, Children} from 'react'
import jwtDecode from 'jwt-decode'

export const AuthContext=createContext();

export const AuthProvider=({Children})=>{
  const[user,setUser]=useState(null);

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(token){
      const decoded=jwtDecode(token);
      setUser(decoded)
    }
  },[]);

  const logout=()=>{
    localStorage.removeItem("token")
    setUser(null);
  }
  return(
    <AuthContext.Provider value={{user,setUser,logout}}>
      {Children}
    </AuthContext.Provider>
  );
};