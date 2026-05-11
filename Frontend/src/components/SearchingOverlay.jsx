import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Bus } from "lucide-react";
import Scene from "./Scene";
import "../styles/searchingoverlay.css";

const TOTAL_DURATION = 300; // 5 minutes in seconds

const SearchingOverlay = ({ from, via, to, onCancel, onDataReady }) => {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);
    const [insightIndex, setInsightIndex] = useState(0);
    const [apiData, setApiData] = useState(null);
    const [error, setError] = useState(null);
    const [timerDone, setTimerDone] = useState(false);

    // Refs so intervals always read the latest values
    const startTimeRef = useRef(Date.now());
    const timerDoneRef = useRef(false);

    const isReady = apiData !== null && timerDone;

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

    // Growth stage label (0–4) based on progress
    const growthStage = Math.min(Math.floor(progress / 20), 4);
    const growthLabels = [
        "Initializing Neural Seed...",
        "Sprouting Digital Life...",
        "Nurturing Data Sapling...",
        "Expanding AI Network...",
        "Tickmybus Fully Bloomed"
    ];

    useEffect(() => {
        // Lock body scroll
        document.body.style.overflow = "hidden";

        // ── Real-time progress clock (runs every 1 second) ──────────────────
        const progressInterval = setInterval(() => {
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            const newProgress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);

            setProgress(newProgress);

            if (elapsed >= TOTAL_DURATION && !timerDoneRef.current) {
                timerDoneRef.current = true;
                setTimerDone(true);
                clearInterval(progressInterval);
            }
        }, 1000);

        // ── Rotate status messages ───────────────────────────────────────────
        const statusInterval = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % statuses.length);
        }, 4000);

        // ── Rotate insight cards ─────────────────────────────────────────────
        const insightInterval = setInterval(() => {
            setInsightIndex((prev) => (prev + 1) % insights.length);
        }, 8000);

        // ── Fetch backend data ───────────────────────────────────────────────
        const fetchData = async () => {
            try {
                const response = await fetch("/api/route-analysis/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ source: from, destination: to, via }),
                });

                if (!response.ok) {
                    let errorMsg = "Failed to fetch route analysis";
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.message || errorMsg;
                    } catch (e) { /* not JSON */ }
                    throw new Error(errorMsg);
                }

                const result = await response.json();
                if (result.status === "success") {
                    setApiData(result.data);
                } else {
                    throw new Error(result.message || "Error analyzing route");
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();

        return () => {
            clearInterval(progressInterval);
            clearInterval(statusInterval);
            clearInterval(insightInterval);
            document.body.style.overflow = "auto";
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Determine status text
    const statusText = () => {
        if (error) return <span style={{ color: "var(--primary)" }}>Error: {error}</span>;
        if (apiData && timerDone) return <span className="success-status">✓ Neural Analysis Complete! Tap Get Data.</span>;

        return statuses[statusIndex];
    };

    const overlayContent = (
        <div className="searching-overlay">
            <div className="searching-card">
                <div className="branding-header">
                    Tick MyBus <span>AI</span>
                </div>

                <div className="ai-badge">
                    <span className="pulse-dot"></span> NEURAL AI PROCESSING ENGINE
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

                        <div className="progress-section">
                            <div className="progress-header-row">
                                <div className="loading-label">Analysis in progress…</div>
                            </div>

                            {/* Bus animation track */}
                            <div className="bus-track">
                                <div className="moving-bus" style={{ left: `${Math.min(progress, 97)}%` }}>
                                    <Bus size={20} />
                                    <div className="bus-exhaust"></div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                            </div>


                        </div>

                        <p className="status-text">{statusText()}</p>

                        <div className="insight-box">
                            <div className="insight-label">{insights[insightIndex].label}</div>
                            <div className="insight-text">{insights[insightIndex].text}</div>
                        </div>
                    </div>
                </div>

                <button
                    className={`get-data-btn ${isReady ? "blinking" : ""}`}
                    disabled={!isReady}
                    onClick={() => onDataReady(apiData)}
                    style={{ opacity: isReady ? 1 : 0.5, cursor: isReady ? "pointer" : "not-allowed" }}
                >
                    {isReady ? " Get Data" : "Scanning…"}
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
