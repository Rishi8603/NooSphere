import React, { useState } from "react";
import { deleteAccount } from "../services/settings";

const Settings = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      window.location.href = "/auth";
    } catch (error) {
      console.error(error);
      alert("Failed to delete your account.");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <hr className="mb-6" />

      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowConfirm(true)}
      >
        Delete Account
      </button>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete your account?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone!
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
