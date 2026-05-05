<<<<<<< HEAD
=======
<<<<<<< HEAD
import React, { useState } from 'react';
import Header from './components/Header';
import MapArea from './components/MapArea';
import Charts from './components/Charts';
import BottomWidgets from './components/BottomWidgets';
import RouteInsights from './components/RouteInsights';
import AreaPotentialMap from './components/AreaPotentialMap';
=======
<<<<<<< HEAD
import React from 'react';
>>>>>>> 6a65c60db754b236a990914d956f0373b98e1ba4
import PremiumReportPage from './components/PremiumReportPage';
import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      <PremiumReportPage />
=======
>>>>>>> dbea7a51e551fa514b2e050dc12f8a9ecfd57ec4
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

<<<<<<< HEAD
  const analyzeRoute = async (source, destination) => {
    if (!source.trim() || !destination.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setRouteData(null);
    setRouteQuery(`${source} to ${destination}`);
    
    try {
      // Fetch from the Django API using the Vite proxy
      const response = await fetch(`/api/route-analysis/?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status === 'error') {
        throw new Error(result.message || 'Analysis failed');
      }
      
      // Backend returns { status: 'success', data: { ... }, data_source: '...' }
      setRouteData(result.data);
    } catch (err) {
      console.error("Failed to analyze route:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
=======
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
>>>>>>> 6a65c60db754b236a990914d956f0373b98e1ba4
  };

  // Initial fetch on mount
  React.useEffect(() => {
    analyzeRoute('Chennai', 'Coimbatore');
  }, []);

  return (
<<<<<<< HEAD
    <div className="app-stack">
      {/* Header Section 
      <Header onAnalyze={analyzeRoute} isLoading={isLoading} />*/}
      
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* 1. Map Section */}
      <section className="app-section map-section animate-fade-in">
        <div className="section-header">
          <h2 className="section-title">Route Overview Map</h2>
        </div>
        <MapArea routeData={routeData} routeQuery={routeQuery} isLoading={isLoading} />
      </section>

      {/* 1.5 Area Potential Corridor Map */}
      <section className="app-section potential-map-section animate-fade-in-up">
        <AreaPotentialMap routeData={routeData} isLoading={isLoading} />
      </section>

      {/* 2. Dashboard Section (Charts & Analytics) */}
      <section className="app-section dashboard-section animate-fade-in-up">
        <div className="section-header">
          <h2 className="section-title">Data Analytics & Insights</h2>
        </div>
        <div className="dashboard-grid">
          <div className="charts-row">
            <Charts routeData={routeData} />
          </div>
          <div className="widgets-row">
            <BottomWidgets routeData={routeData} />
          </div>
          <div className="insights-row">
            <RouteInsights routeQuery={routeQuery} routeData={routeData} />
          </div>
        </div>
      </section>

      {/* 3. Premium Report Page Section */}
      <section className="app-section premium-section animate-fade-in-up">
        <div className="section-header">
          <h2 className="section-title">Premium Corridor Report</h2>
        </div>
        <PremiumReportPage routeData={routeData} />
      </section>

=======
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

>>>>>>> 6a65c60db754b236a990914d956f0373b98e1ba4
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Route Analysis AI</p>
      </footer>
    </div>
  );
}

export default App;