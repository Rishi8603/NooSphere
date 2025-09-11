import React,{useContext} from "react";
import { AuthContext } from '../context/AuthContext'; // Import the context

const Sidebar=()=>{
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
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
}

export default Sidebar