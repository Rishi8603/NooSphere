import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="flex-shrink-0 w-16 md:w-64 transition-width duration-300 fixed left-0 top-0 bottom-0 z-40">
        <Sidebar />
      </div>

      <main id="main-scroll" className="flex-1 overflow-y-auto ml-16 md:ml-64">
        <Outlet />{/* we don't use children anymore*/}
      </main>
    </div>
  );
};

export default Layout;