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
      <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Settings</h2>
      <hr style={{ borderColor: 'var(--border-color)' }} className="mb-6" />

      <button
        className="btn-danger"
        onClick={() => setShowConfirm(true)}
      >
        Delete Account
      </button>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-card text-center">
            <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Are you sure you want to delete your account?
            </h3>
            <p className="text-xs sm:text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              This action cannot be undone!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                className="btn-ghost order-2 sm:order-1"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn-danger order-1 sm:order-2"
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