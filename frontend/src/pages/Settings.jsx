import React from 'react';
import { deleteAccount } from '../services/settings';

const handleDelete = async () => {
  if (window.confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
    try {
      await deleteAccount();
      window.location.href = "/auth";
    } catch (error) {
      alert("Failed to delete your account.");
    }
  }
};

const Settings = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        onClick={handleDelete}
      >
        Delete Account
      </button>
    </div>
  );
};

export default Settings;
