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
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Settings</h2>
      <hr className="mb-6" />

      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
        onClick={() => setShowConfirm(true)}
      >
        Delete Account
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center max-w-md w-full">
            <h3 className="text-base sm:text-lg font-semibold mb-4">
              Are you sure you want to delete your account?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              This action cannot be undone!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded text-sm sm:text-base order-2 sm:order-1"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm sm:text-base order-1 sm:order-2"
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