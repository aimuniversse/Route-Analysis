<<<<<<< HEAD
import React from 'react';
import PremiumReportPage from './components/PremiumReportPage';
import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      <PremiumReportPage />
=======
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import SplashScreen from "./components/SplashScreen";
import RouteResults from "./components/RouteResults";

// Team components
import MapArea from "./components/MapArea";
import Charts from "./components/Charts";
import BottomWidgets from "./components/BottomWidgets";
import RouteInsights from "./components/RouteInsights";
import PremiumReportPage from "./components/PremiumReportPage";

import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);

  // Team states
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

  // Route analysis function (now receives data from SearchBox -> SearchingOverlay)
  const handleRouteResults = (data, routeString) => {
    setIsLoading(false);
    setError(null);
    setRouteData(data);
    setResults(data); // Pass down the AI data
    setRouteQuery(routeString || "Custom Route");
  };

  return (
    <div className="app">
      {loading && <SplashScreen />}

      <Navbar />

      {/* If results exist → show full dashboard */}
      {results ? (
        <>
          <RouteResults data={results} onBack={() => setResults(null)} />

          {error && <div className="error-banner">{error}</div>}

          {/* Map Section */}
          <section className="app-section map-section">
            <h2>Route Overview Map</h2>
            <MapArea routeData={routeData} routeQuery={routeQuery} isLoading={isLoading} />
          </section>

          {/* Dashboard Section */}
          <section className="app-section dashboard-section">
            <h2>Data Analytics & Insights</h2>

            <Charts routeData={routeData} />
            <BottomWidgets routeData={routeData} />
            <RouteInsights routeQuery={routeQuery} routeData={routeData} />
          </section>

          {/* Premium Section */}
          <section className="app-section premium-section">
            <h2>Premium Corridor Report</h2>
            <PremiumReportPage />
          </section>
        </>
      ) : (
        <>
          <Hero onResults={handleRouteResults} />
          <Features />
        </>
      )}

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Route Analysis AI</p>
      </footer>
>>>>>>> 76bf54b7a29fabb6bf607653c1389d979ee0f2e0
    </div>
  );
}

export default App;