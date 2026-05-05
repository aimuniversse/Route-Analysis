import React from "react";
import logo from "../assets/Tickmybus logo.svg";
import "../styles/splashscreen.css";

const SplashScreen = () => {
    return (
        <div className="splash-screen">
            <div className="splash-logo-container">
                <img src={logo} alt="Tickmybus Logo" className="splash-logo" />
                <div className="splash-loader"></div>
            </div>
        </div>
    );
};

export default SplashScreen;
