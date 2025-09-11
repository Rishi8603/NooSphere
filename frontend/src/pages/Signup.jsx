import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import { signup } from "../services/authService";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError]=useState("")
  const navigate=useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();//it stops reloading of page
    try{
      const data=await signup(formData);//call backend
      console.log("SignUp success:" ,data)
      navigate('/auth')
    }catch(err){
      console.log("Signup error:",err);
      setError(err.message || "signup failed")
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-4 border rounded w-80">
        <h2 className="text-2xl mb-4">Signup</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input
          name="name"
          placeholder="Username"
          value={formData.name}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />

        <button type="submit" className="bg-blue-500 text-white p-2 w-full">Signup</button>
      </form>
    </div>
  );
};

export default Signup;