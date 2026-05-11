import React from "react";
import logo from "../assets/Tickmybus logo.svg";
import "../styles/navbar.css";

const Navbar = ({ onHomeClick, onSearchClick, onHelpClick, onAuthClick, onProfileClick, userData, activeTab = "home", isLoggedIn }) => {
    return (
        <nav className="navbar animate-slide-down">
            {/* ... logo ... */}
            <div className="logo" onClick={onHomeClick} style={{ cursor: 'pointer' }}>
                <div className="logo-icon">
                    <img src={logo} alt="Tickmybus Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="logo-text">
                    <h2>Tick<span>MyBus</span></h2>
                    <p>AI-Powered Route Intelligence</p>
                </div>
            </div>

            <ul className="nav-links">
                {/* ... nav links ... */}
                <li
                    className={activeTab === "home" ? "active" : ""}
                    onClick={onHomeClick}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Home
                </li>
                <li
                    className={activeTab === "search" ? "active" : ""}
                    onClick={onSearchClick}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    Search
                </li>
                <li
                    className={activeTab === "help" ? "active" : ""}
                    onClick={onHelpClick}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    Help
                </li>

                <li className="nav-divider"></li>

                {!isLoggedIn ? (
                    <li className="auth-trigger">
                        <button className="signin-btn" onClick={() => onAuthClick(true)}>Sign In</button>
                        <button className="signup-btn" onClick={() => onAuthClick(false)}>Register</button>
                    </li>
                ) : (
                    <li className="auth-trigger">
                        <div className="user-profile clickable" onClick={onProfileClick}>
                            <div className="user-avatar">
                                {userData?.ownerName?.charAt(0) || "U"}
                            </div>
                            <span>{userData?.ownerName?.split(' ')[0] || "Profile"}</span>
                        </div>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;