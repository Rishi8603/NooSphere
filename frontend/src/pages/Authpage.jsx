import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const Authpage = () => {
  // This state determines which form to show
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => {
    setIsLoginView(!isLoginView); // Flips the boolean value
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {/* Conditionally render either the Login or Signup component */}
      {isLoginView ? <Login /> : <Signup />}

      <div className="mt-4">
        {isLoginView ? (
          <p>
            Don't have an account?{" "}
            <button onClick={toggleView} className="text-blue-500 hover:underline">
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button onClick={toggleView} className="text-blue-500 hover:underline">
              Log in
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Authpage;