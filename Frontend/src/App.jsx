<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import SplashScreen from "./components/SplashScreen";
import RouteResults from "./components/RouteResults";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Show splash for 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      {loading && <SplashScreen />}
      <Navbar />
      {results ? (
        <RouteResults data={results} onBack={() => setResults(null)} />
      ) : (
        <>
          <Hero onResults={(data) => setResults(data)} />
          <Features />
        </>
      )}
=======
import React, { useState } from 'react';
import Header from './components/Header';
import MapArea from './components/MapArea';
import Charts from './components/Charts';
import BottomWidgets from './components/BottomWidgets';
import RouteInsights from './components/RouteInsights';
import PremiumReportPage from './components/PremiumReportPage';
import './App.css';

function App() {
  const [routeData, setRouteData] = useState(null);
  const [routeQuery, setRouteQuery] = useState('Chennai to Coimbatore');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeRoute = async (routeString) => {
    if (!routeString.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setRouteData(null);
    setRouteQuery(routeString);
    
    try {
      const response = await fetch(`/testing/?route=${encodeURIComponent(routeString)}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setRouteData(result.json_data || result.data);
    } catch (err) {
      console.error("Failed to analyze route:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-stack">
      {/* Header Section 
      <Header onAnalyze={analyzeRoute} isLoading={isLoading} /> */}
      
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
            <RouteInsights routeQuery={routeQuery} />
          </div>
        </div>
      </section>

      {/* 3. Premium Report Page Section */}
      <section className="app-section premium-section animate-fade-in-up">
        <div className="section-header">
          <h2 className="section-title">Premium Corridor Report</h2>
        </div>
        <PremiumReportPage />
      </section>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Route Analysis AI. All Rights Reserved.</p>
      </footer>
>>>>>>> 551348bbb73abcbabe6c95d4b6da14a24f9d08ae
    </div>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 551348bbb73abcbabe6c95d4b6da14a24f9d08ae
