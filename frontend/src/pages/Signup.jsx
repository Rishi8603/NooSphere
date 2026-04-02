import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import { signup, googleLogin } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import visibleIcon from "../assets/visible.png";
import invisibleIcon from "../assets/invisible.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const googleBtnRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(formData);
      console.log("SignUp success:", data)
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      console.error("Signup error:", err);
      const message =
        err.response?.data?.message || err.message || "Signup failed";
      setError(message);
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      const data = await googleLogin(response.credential);
      localStorage.setItem("token", data.authToken);
      const decodedUser = jwtDecode(data.authToken);
      setUser(decodedUser.user);
      navigate("/");
    } catch (err) {
      console.error("Google signup error:", err);
      setError(err.message || "Google signup failed");
    }
  };

  useEffect(() => {
    if (window.google && googleBtnRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "signup_with",
      });
    }
  }, []);

  return (
    <div className="auth-card-inner">
      <h2>Create account</h2>
      <p className="auth-subtitle">Get started with NooSphere</p>

      {error && <div className="auth-error">{error}</div>}
      {isSuccess && <div className="auth-success">Account created successfully!</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label htmlFor="signup-name">Username</label>
          <input
            id="signup-name"
            name="name"
            placeholder="Choose a username"
            value={formData.name}
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="auth-password-toggle"
          >
            {showPassword ? (
              <img src={visibleIcon} alt="Show Password" />
            ) : (
              <img src={invisibleIcon} alt="Hide Password" />
            )}
          </button>
        </div>

        <button type="submit" className="auth-submit-btn">Create account</button>
      </form>

      <div className="auth-divider">
        <hr />
        <span>OR</span>
        <hr />
      </div>

      <div ref={googleBtnRef} className="auth-google-btn"></div>
    </div>
  );
};

export default Signup;