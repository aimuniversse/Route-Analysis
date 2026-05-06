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
import SearchingOverlay from "./components/SearchingOverlay";

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
  
  // Track if user has performed a search to toggle Hero view
  const [hasSearched, setHasSearched] = useState(false);
  const [viaCity, setViaCity] = useState("");

<<<<<<< HEAD
  // Route Analysis Function (from Header)
=======
<<<<<<< HEAD
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
=======
  // Route Analysis Function
>>>>>>> b1172839a1b6d322a3817ac511f9835fac1b91fd
  const analyzeRoute = async (source, destination) => {
    if (!source.trim() || !destination.trim()) return;
    setRouteQuery(`${source} to ${destination}`);
    setViaCity("");
    setIsLoading(true);
  };

  const handleSearchResults = (data, query, via = "") => {
    if (!data) {
      // Triggered by SearchBox to start search
      setRouteQuery(query);
      setViaCity(via);
      setIsLoading(true);
      return;
    }
    
    setRouteData(data);
    setRouteQuery(query);
    setHasSearched(true);
    setIsLoading(false);
    
    // Smooth scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial Route Load removed for cleaner landing page

  return (
    <div className="app-wrapper">
      {/* Optional Splash Screen */}
      {loading && (
        <SplashScreen onFinish={() => setLoading(false)} />
      )}

      {/* Navbar */}
      <Navbar />

      {/* Conditional Hero/Search View */}
      {!hasSearched ? (
        <>
          <Hero onResults={handleSearchResults} />
          <Features />
        </>
      ) : (
        <div className="results-view-header">
           <Header onAnalyze={analyzeRoute} isLoading={isLoading} />
           <div className="app-section pt-4">
             <button 
               className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
               onClick={() => setHasSearched(false)}
             >
               ← Back to Home
             </button>
           </div>
        </div>
      )}

      {/* Searching Overlay */}
      {isLoading && (
        <SearchingOverlay
          from={routeQuery.split(" to ")[0] || "Origin"}
          to={routeQuery.split(" to ")[1] || "Destination"}
          via={viaCity}
          onCancel={() => setIsLoading(false)}
          onDataReady={(data) => handleSearchResults(data, routeQuery)}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Results Stack - Only shown after search */}
      {hasSearched && (
        <div className="app-stack">
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
        </div>
      )}

      {/* Route Results (Optional Legacy Component) */}
      {results && <RouteResults results={results} />}

      {/* Footer */}
      <footer className="app-footer">
        <p>
          © {new Date().getFullYear()} Route Analysis AI
        </p>
>>>>>>> 1a4096c879c37015fd7709f92c30060ea02cd6f8
      </footer>
    </div>
  );
}

export default App;