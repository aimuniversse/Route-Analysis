import React, { useState, useEffect } from "react";

// Main Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import SplashScreen from "./components/SplashScreen";
import RouteResults from "./components/RouteResults";
import AuthModal from "./components/AuthModal";
import ProfileModal from "./components/ProfileModal";

// Route Analysis Components
import Header from "./components/Header";
import MapArea from "./components/MapArea";
import LuggageShare from "./components/LuggageShare";
import Charts from "./components/Charts";
import BottomWidgets from "./components/BottomWidgets";
import RouteInsights from "./components/RouteInsights";
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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [authInitialMode, setAuthInitialMode] = useState(true);
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

  const handleLoginSuccess = (data) => {
    setUserData(data);
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userData", JSON.stringify(data));
    setIsAuthModalOpen(false);
    // After login, show the "landing page" which is the home/create UI
    setActiveTab("home");
    setHasSearched(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    setHasSearched(false);
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleUpdateUser = (updatedData) => {
    setUserData(updatedData);
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

  // Real-time synchronization (Polling — every 5 minutes to avoid API overload)
  const consecutiveFailures = React.useRef(0);

  const refreshRouteData = async () => {
    if (!hasSearched || !routeQuery || isLoading) return;
    // Pause polling after 2 consecutive backend failures
    if (consecutiveFailures.current >= 2) return;

    const parts = routeQuery.split(" to ");
    const source = parts[0]?.trim();
    const destination = parts[1]?.trim();

    if (!source || !destination) return;

    try {
      const response = await fetch("/api/route-analysis/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, destination, via: viaCity }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === "success") {
          setRouteData(result.data);
          consecutiveFailures.current = 0; // Reset on success
          console.debug("Real-time data synced:", new Date().toLocaleTimeString());
        }
      } else {
        consecutiveFailures.current += 1;
        console.warn(`Background sync returned ${response.status} (${consecutiveFailures.current}/2 failures)`);
      }
    } catch (err) {
      consecutiveFailures.current += 1;
      console.warn("Background sync failed:", err.message);
    }
  };

  useEffect(() => {
    let interval;
    if (hasSearched && routeQuery && isLoggedIn) {
      // Poll every 5 minutes — route data doesn't change frequently
      interval = setInterval(() => {
        refreshRouteData();
      }, 300000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasSearched, routeQuery, isLoggedIn, viaCity]);

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
        onProfileClick={handleProfileClick}
        userData={userData}
        activeTab={activeTab}
        isLoggedIn={isLoggedIn}
      />

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        userData={userData} 
        onLogout={handleLogout} 
        onUpdateUser={handleUpdateUser}
      />

      {/* Home / Hero Section */}
      {!hasSearched ? (
        <div id="hero-search">
          <Hero onResults={handleSearchResults} />
          {!isLoggedIn && <Features />}
        </div>
      ) : (
        <div className="results-view-header" id="header-search">
          {/*<Header onAnalyze={analyzeRoute} isLoading={isLoading} /> */}

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

          {/* Luggage Share */}
          {routeData && (
            <section className="app-section luggage-section animate-fade-in-up">
              <div className="section-header">
                <h2 className="section-title">Luggage &amp; Parcel Share</h2>
              </div>
              <LuggageShare
                routeData={routeData}
                sourceName={
                  routeData?.population_data?.source?.name ||
                  routeQuery?.split(' to ')[0]?.trim()
                }
                destName={
                  routeData?.population_data?.destination?.name ||
                  routeQuery?.split(' to ')[1]?.trim()
                }
              />
            </section>
          )}

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

            <PremiumReportPage routeData={routeData} isLoading={isLoading} />
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