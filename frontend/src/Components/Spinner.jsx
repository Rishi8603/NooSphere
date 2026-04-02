import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '3px solid var(--border-color)', borderTopColor: 'var(--accent)' }}></div>
    </div>
  );
};

export default Spinner;
