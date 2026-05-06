import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Scene from "./Scene";
import "../styles/searchingoverlay.css";

const SearchingOverlay = ({ from, via, to, onCancel, onDataReady }) => {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);
    const [insightIndex, setInsightIndex] = useState(0);
    const [apiData, setApiData] = useState(null);
    const [error, setError] = useState(null);
    const [apiFinished, setApiFinished] = useState(false);

    const getViaCities = (f, v, t) => {
        let route = [];
        if (f === "Chennai" && t === "Coimbatore") route = ["Vellore", "Salem", "Erode"];
        if (v && !route.includes(v)) route.push(v);
        return route;
    };

    const viaCities = getViaCities(from, via, to);

    const statuses = [
        "Initializing Neural Route Engine...",
        `Scanning traffic patterns in ${from}...`,
        ...viaCities.map(city => `Analyzing real-time congestion in ${city}...`),
        "Analyzing 1,400+ historical route data...",
        "Connecting to satellite GPS feed...",
        "Calculating optimal fuel-efficiency paths...",
        `Verifying seat availability in ${to}...`,
        "Optimizing multi-operator schedules...",
        "Applying AI-driven price protection...",
        "Finalizing smart route selection..."
    ];

    const insights = [
        { label: "AI Tip", text: "Routes analyzed by AI typically arrive 15% faster by avoiding mid-journey congestion hotspots." },
        { label: "Did You Know?", text: "Tickmybus AI scans over 500 data points per second to ensure your journey is safe and on time." },
        { label: "Travel Fact", text: "The Hyderabad to Vijayawada route is most scenic during the early morning AI-suggested slots." },
        { label: "Smart Choice", text: "Choosing 'Eco-Routes' helps reduce carbon emissions by up to 12% without increasing travel time." },
        { label: "Security", text: "Every booking is monitored by our 24/7 AI Security Layer for your peace of mind." }
    ];

    // Growth Stages based on progress (0 to 100)
    const growthStage = Math.min(Math.floor(progress / 20), 5);

    const growthLabels = [
        "Planting Seed...",
        "Sprouting Intelligence...",
        "Growing Sapling...",
        "Expanding Branches...",
        "Lush Bloom...",
        "Tickmybus Fully Grown!"
    ];

    useEffect(() => {
        // Rotate Statuses
        const statusInterval = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % statuses.length);
        }, 4000);

        // Rotate Insights
        const insightInterval = setInterval(() => {
            setInsightIndex((prev) => (prev + 1) % insights.length);
        }, 8000);

        // Fetch Data from Backend
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/route-analysis/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        source: from,
                        destination: to,
                        via: via
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch route analysis");
                }

                const result = await response.json();
                if (result.status === "success") {
                    setApiData(result.data);
                    setApiFinished(true);
                } else {
                    throw new Error(result.message || "Error analyzing route");
                }
            } catch (err) {
                setError(err.message);
                setApiFinished(true);
            }
        };

        fetchData();

        // Progress Animation: Slow while loading, fast-forward when done
        const tickRate = apiFinished ? 20 : 3000; // Exactly 5 mins total (3000ms * 100), or zoom to 100% if done

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95 && !apiFinished) return 95; // Wait at 95% if API is not yet done
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + (apiFinished ? 2 : 1); // Jump faster if finished
            });
        }, tickRate);

        return () => {
            clearInterval(statusInterval);
            clearInterval(insightInterval);
            clearInterval(progressInterval);
        };
    }, [apiFinished]);

    const overlayContent = (
        <div className="searching-overlay">
            <div className="searching-card">
                <div className="branding-header">
                    Tickmybus <span>AI</span>
                </div>

                <div className="ai-badge">
                    <span></span> AI Neural Processing
                </div>

                <div className="content-layout">
                    <div className="growth-animation">
                        <div className="tree-container">
                            <Scene progress={progress} />
                            <div className="growth-indicator">{growthLabels[growthStage]}</div>
                        </div>
                    </div>

                    <div className="searching-info">
                        <h2>Finding Best Routes</h2>
                        <div className="route-text">
                            {from} {viaCities.map(city => (
                                <React.Fragment key={city}>
                                    <span>→</span> {city}
                                </React.Fragment>
                            ))} <span>→</span> {to}
                        </div>

                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>

                        <p className="status-text">{error ? <span style={{color: 'var(--primary)'}}>Error: {error}</span> : statuses[statusIndex]}</p>

                        <div className="insight-box">
                            <div className="insight-label">{insights[insightIndex].label}</div>
                            <div className="insight-text">{insights[insightIndex].text}</div>
                        </div>
                    </div>
                </div>

                <button
                    className={`get-data-btn ${apiData ? 'blinking' : ''}`}
                    disabled={!apiData}
                    onClick={() => onDataReady(apiData)}
                    style={{ opacity: apiData ? 1 : 0.5, cursor: apiData ? 'pointer' : 'not-allowed' }}
                >
                    Get Data
                </button>

                <button className="cancel-btn" onClick={onCancel}>
                    Cancel Search
                </button>
            </div>
        </div>
    );

    return createPortal(overlayContent, document.body);
};

export default SearchingOverlay;
