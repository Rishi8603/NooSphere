import React from 'react';
import Sidebar from '../components/Sidebar';
import Feed from './Feed';

const Homepage = () => {
  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <Sidebar/>
      </div>

      <div className="w-3/4">
        <Feed/>
      </div>
    </div>
  );
};

export default Homepage;