import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, Phone, Building, MapPin } from "lucide-react";
import "../styles/authModal.css";

const AuthModal = ({ isOpen, onClose, onLoginSuccess, initialIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    MobileNumber: "",
    Location: "",
    password: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Simulate API call
    console.log("Form submitted:", formData);
    // In a real app, you'd validate and send to backend
    onLoginSuccess();
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-overlay animate-fade">
      <div className={`auth-card animate-slide-up glass-panel ${!isLogin ? 'signup-mode' : ''}`}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back" : "Partner Registration"}</h2>
          <p>{isLogin ? "Sign in to continue your route analysis" : "Join Tickmybus to manage your route intelligence"}</p>
        </div>


        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
            <div className="auth-form-grid">
              <div className="input-group animate-fade-in">
                <label htmlFor="companyName">Company Name</label>
                <div className="input-wrapper">
                  <Building size={18} className="input-icon" />
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Travels Name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              </div>

              <div className="input-group animate-fade-in">
                <label htmlFor="ownerName">Owner Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    placeholder="Owner Name"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              </div>

              <div className="input-group animate-fade-in">
                <label htmlFor="MobileNumber">Mobile Number</label>
                <div className="input-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="tel"
                    id="MobileNumber"
                    name="MobileNumber"
                    placeholder="Mobile Number"
                    value={formData.MobileNumber}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              </div>

              <div className="input-group animate-fade-in">
                <label htmlFor="Location">Location</label>
                <div className="input-wrapper">
                  <MapPin size={18} className="input-icon" />
                  <input
                    type="text"
                    id="Location"
                    name="Location"
                    placeholder="City, State"
                    value={formData.Location}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              </div>

              <div className="input-group full-width">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="hello@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group animate-fade-in">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              </div>
            </div>
            </>
          )}


          {isLogin && (
            <>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="hello@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="forgot-password">
                <a href="#">Forgot password?</a>
              </div>
            </>
          )}

          <button type="submit" className="submit-btn primary-glow">
            {isLogin ? "Sign In" : "Register Now"}
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-footer">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
