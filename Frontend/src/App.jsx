import React, { useState, useEffect } from "react";

// Main Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import SplashScreen from "./components/SplashScreen";
import RouteResults from "./components/RouteResults";
import AuthModal from "./components/AuthModal";

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

  const [hasSearched, setHasSearched] = useState(false);
  const [viaCity, setViaCity] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  // Auth States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState(true);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Auth Handlers
  const handleAuthClick = (isLogin = true) => {
    setAuthInitialMode(isLogin);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    // After login, show the "landing page" which is the home/create UI
    setActiveTab("home");
    setHasSearched(false);
  };

  // Route analysis function
  const analyzeRoute = async (source, destination) => {
    if (!source.trim() || !destination.trim()) return;

    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    setRouteQuery(`${source} to ${destination}`);
    setViaCity("");
    setIsLoading(true);
  };

  // Handle route results
  const handleSearchResults = (data, query, via = "") => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

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
    setActiveTab("search");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Navbar handlers
  const handleHomeClick = () => {
    setHasSearched(false);
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchClick = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setActiveTab("search");
    if (!hasSearched) {
      const searchBox = document.getElementById("hero-search");
      if (searchBox) {
        searchBox.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      const headerSearch = document.getElementById("header-search");
      if (headerSearch) {
        headerSearch.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleHelpClick = () => {
    setActiveTab("help");
    const footer = document.getElementById("app-footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="app-wrapper">
      {/* Splash Screen */}
      {loading && (
        <SplashScreen onFinish={() => setLoading(false)} />
      )}

      {/* Auth Modal */}
      <AuthModal 
        key={isAuthModalOpen ? 'open' : 'closed'}
        isOpen={isAuthModalOpen} 
        initialIsLogin={authInitialMode}
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Navbar */}
      <Navbar 
        onHomeClick={handleHomeClick} 
        onSearchClick={handleSearchClick} 
        onHelpClick={handleHelpClick}
        onAuthClick={handleAuthClick}
        activeTab={activeTab}
        isLoggedIn={isLoggedIn}
      />

      {/* Home / Hero Section */}
      {!hasSearched ? (
        <div id="hero-search">
          <Hero onResults={handleSearchResults} />
          {!isLoggedIn && <Features />}
        </div>
      ) : (
        <div className="results-view-header" id="header-search">
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

      {/* Footer / Help Section */}
      {!hasSearched && (
        <footer className="app-footer" id="app-footer">
          <div className="footer-help-section">
            <h3>Need Help?</h3>
            <p>Get the most out of our AI-powered route intelligence. Whether you're looking for new route opportunities or analyzing existing ones, we're here to help.</p>
            <div className="help-links">
              <a href="mailto:support@tickmybus.com" className="help-link">Contact Support</a>
              <span className="separator">|</span>
              <a href="#" className="help-link">Documentation</a>
              <span className="separator">|</span>
              <a href="#" className="help-link">FAQs</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} Route Analysis AI | Powered by AIM UNIVERSSE
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;