import React, { useState } from 'react';
import Header from './components/Header';
import MapArea from './components/MapArea';
import Charts from './components/Charts';
import BottomWidgets from './components/BottomWidgets';
import RouteInsights from './components/RouteInsights';
import AreaPotentialMap from './components/AreaPotentialMap';
import PremiumReportPage from './components/PremiumReportPage';
import './App.css';

function App() {
  const [routeData, setRouteData] = useState(null);
  const [routeQuery, setRouteQuery] = useState('Chennai to Coimbatore');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
  };

  // Initial fetch on mount
  React.useEffect(() => {
    analyzeRoute('Chennai', 'Coimbatore');
  }, []);

  return (
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

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Route Analysis AI. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
