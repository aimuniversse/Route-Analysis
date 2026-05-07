import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import SplashScreen from "./components/SplashScreen";
import RouteResults from "./components/RouteResults";

// Dashboard components
import MapArea from "./components/MapArea";
import Charts from "./components/Charts";
import BottomWidgets from "./components/BottomWidgets";
import RouteInsights from "./components/RouteInsights";
import PremiumReportPage from "./components/PremiumReportPage";

import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);

  // Route analysis states
  const [routeData, setRouteData] = useState(null);
  const [routeQuery, setRouteQuery] = useState("Chennai to Coimbatore");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Route analysis function
  const analyzeRoute = async (source, destination) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/route-analysis/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: source,
          destination: destination,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch route analysis");
      }

      const result = await response.json();
      if (result.status === "success") {
        setRouteData(result.data);
        setResults(result.data);
        setRouteQuery(`${source} to ${destination}`);
      } else {
        throw new Error(result.message || "Error analyzing route");
      }
    } catch (err) {
      console.error("Route analysis failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle results from Hero -> SearchBox -> SearchingOverlay
  const handleRouteResults = (data, routeString) => {
    setIsLoading(false);
    setError(null);
    setRouteData(data);
    setResults(data); // Pass down the AI data
    setRouteQuery(routeString || "Custom Route");
  };

  // Initial fetch (optional - commented out to show Hero first if no results)
  /*
  useEffect(() => {
    analyzeRoute('Chennai', 'Coimbatore');
  }, []);
  */

  return (
    <div className="app">
      {loading && <SplashScreen />}

      <Navbar />

      {/* If results exist → show full dashboard */}
      {results ? (
        <div className="dashboard-view animate-fade-in">
          <RouteResults data={results} onBack={() => setResults(null)} />

          {error && <div className="error-banner">{error}</div>}

          {/* Map Section */}
          <section className="app-section map-section">
            <div className="section-header">
              <h2>Route Overview Map</h2>
              <span className="route-badge">{routeQuery}</span>
            </div>
            <MapArea routeData={routeData} routeQuery={routeQuery} isLoading={isLoading} />
          </section>

          {/* Dashboard Section */}
          <section className="app-section dashboard-section">
            <div className="section-header">
              <h2>Data Analytics & Insights</h2>
            </div>
            <div className="dashboard-grid">
              <Charts routeData={routeData} />
              <BottomWidgets routeData={routeData} />
              <RouteInsights routeQuery={routeQuery} routeData={routeData} />
            </div>
          </section>

          {/* Premium Section */}
          <section className="app-section premium-section">
            <div className="section-header">
              <h2>Premium Corridor Report</h2>
            </div>
            <PremiumReportPage />
          </section>
        </div>
      ) : (
        <div className="landing-view">
          <Hero onResults={handleRouteResults} />
          <Features />
        </div>
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Route Analysis AI. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;