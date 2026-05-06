import React, { useState, useEffect } from "react";

// Main Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import SplashScreen from "./components/SplashScreen";
import RouteResults from "./components/RouteResults";

// Route Analysis Components
import Header from "./components/Header";
import MapArea from "./components/MapArea";
import Charts from "./components/Charts";
import BottomWidgets from "./components/BottomWidgets";
import RouteInsights from "./components/RouteInsights";
import AreaPotentialMap from "./components/AreaPotentialMap";
import PremiumReportPage from "./components/PremiumReportPage";

import "./App.css";

function App() {
  // Landing Page States
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);

  // Route Analysis States
  const [routeData, setRouteData] = useState(null);
  const [routeQuery, setRouteQuery] = useState("Chennai to Coimbatore");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Route Analysis Function
  const analyzeRoute = async (source, destination) => {
    if (!source.trim() || !destination.trim()) return;

    setIsLoading(true);
    setError(null);
    setRouteData(null);
    setRouteQuery(`${source} to ${destination}`);

    try {
      // Fetch data from Django API
      const response = await fetch(
        `/api/route-analysis/?source=${encodeURIComponent(
          source
        )}&destination=${encodeURIComponent(destination)}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === "error") {
        throw new Error(result.message || "Analysis failed");
      }

      // Backend response
      setRouteData(result.data);
    } catch (err) {
      console.error("Failed to analyze route:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Route Load
  useEffect(() => {
    analyzeRoute("Chennai", "Coimbatore");
  }, []);

  return (
    <div className="app-wrapper">
      {/* Optional Splash Screen */}
      {loading && (
        <SplashScreen onFinish={() => setLoading(false)} />
      )}

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Route Analysis Header */}
      <Header onAnalyze={analyzeRoute} isLoading={isLoading} />

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Map Section */}
      <section className="app-section map-section animate-fade-in">
        <div className="section-header">
          <h2 className="section-title">Route Overview Map</h2>
        </div>

        <MapArea
          routeData={routeData}
          routeQuery={routeQuery}
          isLoading={isLoading}
        />
      </section>

      {/* Area Potential Map */}
      <section className="app-section potential-map-section animate-fade-in-up">
        <AreaPotentialMap
          routeData={routeData}
          isLoading={isLoading}
        />
      </section>

      {/* Analytics Dashboard */}
      <section className="app-section dashboard-section animate-fade-in-up">
        <div className="section-header">
          <h2 className="section-title">
            Data Analytics & Insights
          </h2>
        </div>

        <div className="dashboard-grid">
          <div className="charts-row">
            <Charts routeData={routeData} />
          </div>

          <div className="widgets-row">
            <BottomWidgets routeData={routeData} />
          </div>

          <div className="insights-row">
            <RouteInsights
              routeQuery={routeQuery}
              routeData={routeData}
            />
          </div>
        </div>
      </section>

      {/* Premium Report Section */}
      <section className="app-section premium-section animate-fade-in-up">
        <div className="section-header">
          <h2 className="section-title">
            Premium Corridor Report
          </h2>
        </div>

        <PremiumReportPage routeData={routeData} />
      </section>

      {/* Route Results */}
      {results && <RouteResults results={results} />}

      {/* Footer */}
      <footer className="app-footer">
        <p>
          © {new Date().getFullYear()} Route Analysis AI
        </p>
      </footer>
    </div>
  );
}

export default App;