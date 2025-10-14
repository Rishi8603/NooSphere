// frontend/src/Components/Sidebar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreatePostClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      const el = document.getElementById("main-scroll");
      el?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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

          {/* CreatePost */}
          <button
            onClick={handleCreatePostClick}

            className="group relative flex items-center gap-3 px-4 py-2 text-lg text-gray-700 rounded-md hover:bg-gray-200 w-full text-left"
          >
            <span className="text-xl">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current text-gray-700">
                <g>
                  <path d="M14.7 18H5.3C3.481 18 2 16.52 2 14.7V5.3C2 3.481 3.48 2 5.3 2h9.4C16.519 2 18 3.48 18 5.3v9.4c0 1.819-1.48 3.3-3.3 3.3zM5.3 3.801A1.5 1.5 0 003.801 5.3v9.4A1.5 1.5 0 005.3 16.199h9.4a1.5 1.5 0 001.499-1.499V5.3A1.5 1.5 0 0014.7 3.801H5.3zM14.4 9.1h-3.5V5.6H9.1v3.5H5.6v1.8h3.5v3.5h1.8v-3.5h3.5V9.1z"></path>                </g>
              </svg>
            </span>
            <span className="hidden md:inline ml-2">Create Post</span>
            <span className="absolute left-14 md:hidden opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity z-50">
              Create Post
            </span>
          </button>

          {/* Settings */}
          <Link
            to={`/settings`}
            className="group relative flex items-center gap-3 px-4 py-2 text-lg text-gray-700 rounded-md hover:bg-gray-200"
          >
            <span className="text-xl">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current text-gray-700">
                <g>
                  <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>                </g>
              </svg>
            </span>
            <span className="hidden md:inline ml-2">Settings</span>
            <span className="absolute left-14 md:hidden opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity z-50">
              Settings
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
