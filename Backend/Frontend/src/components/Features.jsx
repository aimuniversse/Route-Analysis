import React, { useState, useEffect } from "react";
import "../styles/features.css";

const CountUp = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Extract the numeric part and handle formatted strings like "1,00,000+"
            const numericEnd = parseInt(end.replace(/,/g, ''));
            setCount(Math.floor(percentage * numericEnd));

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    // Re-format with commas if necessary
    const formatted = count.toLocaleString('en-IN');
    const suffix = end.includes('+') ? '+' : '';
    const labelSuffix = end.toLowerCase().includes('l') ? 'L' : '';

    return <span>{formatted}{labelSuffix}{suffix}</span>;
};

const Features = () => {
    const featureData = [
        {
            title: "Deep Route Analysis",
            desc: "Neural networks analyze patterns for optimal travel",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>
        },
        {
            title: "Real Time AI-Logic",
            desc: "Dynamic adjustment based on traffic & demand",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        },
        {
            title: "Secure Prediction",
            desc: "Accuracy in Route safety and Arrival Time ",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        },
        {
            title: "AI Route Tracking",
            desc: "Track your route with intellignence",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        }
    ];

    const statsData = [
        { label: "Bus Operators", value: "5000+", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> },
        { label: "Routes Covered", value: "1,00,000+", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 12 10 10 10-10"></path><path d="m2 5 10 10 10-10"></path></svg> },
        { label: "Happy Customers", value: "50L+", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
        { label: "Bookings Completed", value: "10L+", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> }
    ];

    return (
        <section className="features-section perspective-container">
            <div className="features-grid animate-slide-up delay-3 tilt-3d">
                {featureData.map((item, index) => (
                    <div key={index} className="feature-card">
                        <div className="icon-box">{item.icon}</div>
                        <div className="info">
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="stats-container animate-slide-up delay-4 tilt-3d">
                <div className="stats-grid">
                    {statsData.map((stat, index) => (
                        <div key={index} className="stat-item">
                            <div className="stat-icon-bg">
                                <div className="stat-icon">{stat.icon}</div>
                            </div>
                            <div className="stat-info">
                                <h3><CountUp end={stat.value} /></h3>
                                <p>{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="trusted-wrapper animate-fade delay-4">
                    <div className="divider-line"></div>
                    <div className="trusted-text">
                        Trusted by millions of travelers across India
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;