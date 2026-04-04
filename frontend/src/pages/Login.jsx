import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login, googleLogin } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import visibleIcon from "../assets/visible.png";
import invisibleIcon from "../assets/invisible.png";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const googleBtnRef = useRef(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(credentials);
      console.log("Login success:", data);
      localStorage.setItem("token", data.authToken);
      const decodedUser = jwtDecode(data.authToken);
      setUser(decodedUser.user);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
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
      console.error("Google login error:", err);
      setError(err.message || "Google login failed");
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
        text: "signin_with",
      });
    }
  }, []);

  return (
    <div className="auth-card-inner">
      <h2>Welcome</h2>
      <p className="auth-subtitle">Sign in to your account</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={credentials.email}
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={credentials.password}
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

        <button type="submit" className="auth-submit-btn">Sign in</button>
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

export default Login;