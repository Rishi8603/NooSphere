import React from 'react';
import Sidebar from '../components/Sidebar';
import Feed from './Feed';

const Homepage = () => {
  return (
    <div className="flex h-screen">
      {/* Container for the Sidebar */}
      <div className="w-1/4 border-r">
        <Sidebar/>
      </div>

      {/* Container for the Feed */}
      <div className="w-3/4">
        <Feed/>
      </div>
    </div>
  );
};

export default Homepage;