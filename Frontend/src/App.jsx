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

  // Route analysis function (receives data from Hero/SearchBox)
  const handleRouteResults = (data, routeString) => {
    setIsLoading(false);
    setError(null);
    setRouteData(data);
    setResults(data); // Shows the dashboard
    setRouteQuery(routeString || "Custom Route");
  };

  return (
    <div className="app">
      {loading && <SplashScreen />}

      <Navbar />

      {/* If results exist → show full dashboard */}
      {results ? (
        <div className="dashboard-container animate-fade-in">
          <RouteResults data={results} onBack={() => setResults(null)} />

          {error && <div className="error-banner">{error}</div>}

          <div className="dashboard-content-stack">
            {/* Map Section */}
            <section className="app-section map-section">
              <div className="section-header">
                <h2 className="section-title">Route Overview Map</h2>
              </div>
              <MapArea routeData={routeData} routeQuery={routeQuery} isLoading={isLoading} />
            </section>

            {/* Dashboard Section */}
            <section className="app-section dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Data Analytics & Insights</h2>
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
                <h2 className="section-title">Premium Corridor Report</h2>
              </div>
              <PremiumReportPage routeData={routeData} />
            </section>
          </div>
        </div>
      ) : (
        <>
          <Hero onResults={handleRouteResults} />
          <Features />
        </>
      )}

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Route Analysis AI | Powered by AIM UNIVERSSE</p>
      </footer>
    </div>
  );
}

export default App;