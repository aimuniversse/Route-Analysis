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
  // States
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);

  const [routeData, setRouteData] = useState(null);
  const [routeQuery, setRouteQuery] = useState("Chennai to Coimbatore");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

<<<<<<< HEAD
  // Route Analysis Function
=======
  const [hasSearched, setHasSearched] = useState(false);
  const [viaCity, setViaCity] = useState("");

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Route analysis function
>>>>>>> d510d0f921cae64759baa3f9cf050f68c275bbee
  const analyzeRoute = async (source, destination) => {
    if (!source.trim() || !destination.trim()) return;

    setRouteQuery(`${source} to ${destination}`);
    setViaCity("");
    setIsLoading(true);
  };

  // Handle route results
  const handleSearchResults = (data, query, via = "") => {
    if (!data) {
      setRouteQuery(query);
      setViaCity(via);
      setIsLoading(true);
      return;
    }

    setRouteData(data);
    setResults(data);
    setRouteQuery(query);

    setHasSearched(true);
    setIsLoading(false);
    setError(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app-wrapper">
      {/* Splash Screen */}
      {loading && (
        <SplashScreen onFinish={() => setLoading(false)} />
      )}

      {/* Navbar */}
      <Navbar />

      {/* Home / Hero Section */}
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
          onDataReady={(data) =>
            handleSearchResults(data, routeQuery)
          }
        />
      )}

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Results Stack */}
      {hasSearched && (
        <div className="app-stack">
          {/* Map Section */}
          <section className="app-section map-section animate-fade-in">
            <div className="section-header">
              <h2 className="section-title">
                Route Overview Map
              </h2>
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

          {/* Dashboard */}
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

          {/* Premium Report */}
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

      {/* Legacy Route Results */}
      {results && (
        <RouteResults results={results} />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>
          © {new Date().getFullYear()} Route Analysis AI | Powered by AIM UNIVERSSE
        </p>
      </footer>
    </div>
  );
}

export default App;