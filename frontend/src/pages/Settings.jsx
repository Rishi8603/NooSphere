import React, { useState, useEffect, useContext } from "react";
import { deleteAccount } from "../services/settings";
import { getUserProfile, updateMe } from "../services/userService";
import { AuthContext } from "../context/AuthContext";

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [interests, setInterests] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isEditingInterests, setIsEditingInterests] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getUserProfile(user.id)
        .then(data => {
          const savedInterests = data.academicInterests || "";
          setInterests(savedInterests);
          if (!savedInterests) {
            setIsEditingInterests(true);
          }
        })
        .catch(err => console.error("Failed to load profile", err));
    }
  }, [user?.id]);

  const handleSaveInterests = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");
    try {
      await updateMe({ academicInterests: interests });
      setIsEditingInterests(false);
      setSaveMessage("Interests saved successfully! Your feed will now be personalized.");
      setTimeout(() => setSaveMessage(""), 4000);
    } catch (err) {
      setSaveMessage("Failed to save interests. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

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
      
      <div className="dark-card mb-8">
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Academic Interests</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Let us know what courses or subjects you're focusing on (e.g., "Data Structures, React, OS"). 
          Our AI will use this to re-rank your feed, bringing the most relevant study materials to the top!
        </p>
        
        {isEditingInterests ? (
          <form onSubmit={handleSaveInterests} className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="e.g. Mathematics, Machine Learning..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="dark-input"
            />
            <div className="flex flex-wrap gap-2 mt-1">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Interests"}
              </button>
              {interests && (
                 <button 
                    type="button" 
                    className="btn-ghost" 
                    onClick={() => setIsEditingInterests(false)}
                 >
                   Cancel
                 </button>
              )}
            </div>
            {saveMessage && <p className="text-sm mt-1" style={{ color: saveMessage.includes("Failed") ? "var(--error)" : "green" }}>{saveMessage}</p>}
          </form>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
               <p style={{ color: 'var(--text-primary)' }}>
                 <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>Current Interests:</span> 
                 <span className="font-semibold">{interests}</span>
               </p>
            </div>
            <button 
              className="btn-ghost self-start"
              onClick={() => setIsEditingInterests(true)}
            >
              Edit Interests
            </button>
            {saveMessage && <p className="text-sm mt-1" style={{ color: saveMessage.includes("Failed") ? "var(--error)" : "green" }}>{saveMessage}</p>}
          </div>
        )}
      </div>

      <hr style={{ borderColor: 'var(--border-color)' }} className="mb-6" />

      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Danger Zone</h3>
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