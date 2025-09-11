import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import the context

const Dashboard = () => {
  // Get user and the logout function directly from our global context
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    // Use the logout function from the context
    // It handles removing the token AND clearing the user state
    logout();
    // The ProtectedRoute will automatically redirect to login
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-3xl mb-4">Dashboard</h1>
      {user ? (
        <>
          {/* Use the user object from the context */}
          <p className="mb-2">Welcome, {user.name || user.email} 👋</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;