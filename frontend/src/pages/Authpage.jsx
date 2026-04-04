import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import { guestLogin } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const Authpage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setGuestError("");
    try {
      const data = await guestLogin();
      localStorage.setItem("token", data.authToken);
      const decodedUser = jwtDecode(data.authToken);
      setUser(decodedUser.user);
      navigate("/");
    } catch (err) {
      console.error("Guest login error:", err);
      setGuestError(err.message || "Guest login failed");
      setGuestLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="globe-placeholder">
          <span className="meridian"></span>
          <span className="meridian"></span>
          <span className="meridian"></span>
          <span className="latitude"></span>
          <span className="latitude"></span>
        </div>
        <div className="auth-brand">
          <h1>NooSphere</h1>
          <p>Connect. Share. Explore.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          {isLoginView ? <Login /> : <Signup />}

          <div className="auth-toggle">
            {isLoginView ? (
              <p>
                Don't have an account?
                <button onClick={toggleView}>Sign up</button>
              </p>
            ) : (
              <p>
                Already have an account?
                <button onClick={toggleView}>Log in</button>
              </p>
            )}
          </div>

          <div className="auth-guest-section">
            <div className="auth-divider">
              <hr />
              <span>OR</span>
              <hr />
            </div>
            {guestError && <div className="auth-error">{guestError}</div>}
            <button
              id="guest-mode-btn"
              className="auth-guest-btn"
              onClick={handleGuestLogin}
              disabled={guestLoading}
            >
              {guestLoading ? "Entering…" : "Continue as Guest"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authpage;