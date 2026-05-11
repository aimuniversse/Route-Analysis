import React from "react";
import { X, Building, User, Mail, Phone, MapPin, LogOut } from "lucide-react";
import "../styles/profileModal.css";

const ProfileModal = ({ isOpen, onClose, userData, onLogout }) => {
  if (!isOpen || !userData) return null;

  return (
    <div className="profile-overlay animate-fade">
      <div className="profile-card animate-slide-up glass-panel">
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="profile-hero">
          <div className="profile-avatar-large">
            {userData.ownerName?.charAt(0) || "U"}
          </div>
          <div className="profile-title-block">
            <h3>{userData.ownerName}</h3>
            <span className="member-badge">Partner Account</span>
          </div>
        </div>

        <div className="profile-sections-grid">
          <div className="profile-section-card">
            <label><Building size={14} /> Organization</label>
            <p>{userData.companyName}</p>
          </div>

          <div className="profile-section-card">
            <label><User size={14} /> Owner Name</label>
            <p>{userData.ownerName}</p>
          </div>

          <div className="profile-section-card">
            <label><Mail size={14} /> Email</label>
            <p>{userData.email}</p>
          </div>

          <div className="profile-section-card">
            <label><Phone size={14} /> Contact</label>
            <p>{userData.MobileNumber}</p>
          </div>

          <div className="profile-section-card full-width">
            <label><MapPin size={14} /> Base Location</label>
            <p>{userData.Location}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="profile-logout-btn" onClick={() => {
            onLogout();
            onClose();
          }}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
