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
    </div>
  );
}

export default App;