import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, Phone, Building, MapPin } from "lucide-react";
import "../styles/authModal.css";

const AuthModal = ({ isOpen, onClose, onLoginSuccess, initialIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/accounts/login/" : "/api/accounts/register/";
      
      const payload = isLogin ? {
        identifier: formData.email,
        password: formData.password
      } : {
        username: formData.email.split('@')[0],
        name: formData.ownerName,
        travels_name: formData.companyName,
        phone_number: formData.MobileNumber,
        email: formData.email,
        place: formData.Location,
        password: formData.password,
        confirm_password: formData.confirmPassword
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const errorText = await response.text();
        console.error("Server returned non-JSON response:", errorText);
        throw new Error("Server error. Please try again later.");
      }

      if (!response.ok) {
        // Handle specific field errors from DRF
        if (typeof data === 'object' && !Array.isArray(data)) {
          const firstError = Object.values(data)[0];
          throw new Error(Array.isArray(firstError) ? firstError[0] : firstError || "An error occurred");
        }
        throw new Error(data.message || "Something went wrong");
      }

      // Store tokens in localStorage
      if (data.access) localStorage.setItem("access_token", data.access);
      if (data.refresh) localStorage.setItem("refresh_token", data.refresh);

      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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

        {error && (
          <div className="auth-error-message animate-shake">
            {error}
          </div>
        )}


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

          <button 
            type="submit" 
            className={`submit-btn primary-glow ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loader-text">Processing...</span>
            ) : (
              <>
                {isLogin ? "Sign In" : "Register Now"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
