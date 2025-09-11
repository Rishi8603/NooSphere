import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // input change handler
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(credentials); // call backend
      console.log("Login success:", data);

      // Save token in localStorage
      localStorage.setItem("token", data.token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-4 border rounded w-80">
        <h2 className="text-2xl mb-4">Login</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="mb-2 p-2 border w-full"
        />

        <button type="submit" className="bg-green-500 text-white p-2 w-full">Login</button>
      </form>
    </div>
  );
};

export default Login;