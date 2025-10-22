import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import { signup } from "../services/authService";
import visibleIcon from "../assets/visible.png";
import invisibleIcon from "../assets/invisible.png";


const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError]=useState("")
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
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
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 1000);
    }catch(err){
      console.error("Signup error:", err);
      const message =
        err.response?.data?.message || err.message || "Signup failed";
      setError(message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-4 border rounded w-80">
        <h2 className="text-2xl mb-4">Signup</h2>

        {error && <p className="text-red-500">{error}</p>}
        {isSuccess && <p className="text-green-500 mb-2">Successfully Created!</p>}

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

        <div className="relative mb-2">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="mb-2 p-2 border w-full"
          />
          <button type="button" onClick={() =>setShowPassword((prev)=>!prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
            {showPassword ? (
              <img
                src={visibleIcon}
                alt="Show Password"
                className="w-6 h-6 mb-2" 
              />
            ) : (
              <img
                src={invisibleIcon}
                alt="Hide Password"
                className="w-6 h-6 mb-2"
              />
            )}
          </button>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">Signup</button>
      </form>
    </div>
  );
};

export default Signup;