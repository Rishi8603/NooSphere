// frontend/src/Components/Sidebar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="md:w-64 w-16 bg-gray-50 h-screen p-2 md:p-4 border-r border-gray-200 flex flex-col justify-between transition-all duration-300">
      <div>
        <Link to="/" className="text-2xl font-bold mb-8 hidden md:block">
          NooSphere
        </Link>
        <nav className="flex flex-col space-y-2">

          {/* Home */}
          <Link
            to="/"
            className="group relative flex items-center gap-3 px-4 py-2 text-lg text-gray-700 rounded-md hover:bg-gray-200"
          >
            <span className="text-xl">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current text-gray-700">
                <g>
                  <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
                </g>
              </svg>
            </span>
            <span className="hidden md:inline ml-2">Home</span>
            <span className="absolute left-14 md:hidden opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity z-50">
              Home
            </span>
          </Link>
          
          {/* Profile */}
          <Link
            to={`/user/${user.id}`}
            className="group relative flex items-center gap-3 px-4 py-2 text-lg text-gray-700 rounded-md hover:bg-gray-200"
          >
            <span className="text-xl">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current text-gray-700">
                <g>
                  <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
                </g>
              </svg>
            </span>
            <span className="hidden md:inline ml-2">My Profile</span>
            <span className="absolute left-14 md:hidden opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity z-50">
              My Profile
            </span>
          </Link>
        </nav>
      </div>
      
      {/* Logout */}
      <div className="mt-auto">
        <p className="text-sm text-gray-600 mb-2 hidden md:block">
          Logged in as <strong>{user.name}</strong>
        </p>
        <button
          onClick={handleLogout}
          className="group relative flex items-center gap-3 w-full px-4 py-2 text-lg text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          <span className="text-xl">
            <svg width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6 stroke-current text-white" fill="none">
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 19C7.58 19 4 15.42 4 11C4 6.58 7.58 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="hidden md:inline ml-2">Logout</span>
          <span className="absolute left-14 md:hidden opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity z-50">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
