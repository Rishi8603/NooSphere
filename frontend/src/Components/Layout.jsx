// frontend/src/Components/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar: Hidden on small screens, fixed width on medium+ */}
      <div className="flex-shrink-0 w-16 md:w-64 transition-width duration-300">
        <Sidebar />
      </div>

      {/* Main Content Area: Takes remaining space and is scrollable */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;