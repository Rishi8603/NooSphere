import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const Authpage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
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
        </div>
      </div>
    </div>
  );
};

export default Authpage;