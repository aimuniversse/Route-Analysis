import React, { useState } from 'react';
import Header from './components/Header';
import MapArea from './components/MapArea';
import Charts from './components/Charts';
import BottomWidgets from './components/BottomWidgets';
import RouteInsights from './components/RouteInsights';
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
    setRouteData(null); // Clear previous data
    setRouteQuery(routeString);
    
    try {
      // Proxy handles /testing -> http://localhost:8000/testing
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

  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="app-container">
      {/* Ambient Animated Background */}
      <div className="ambient-background">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <main className="main-content">
        <div className="animate-fade-in-up">
         {/*<Header onAnalyze={analyzeRoute} isLoading={isLoading} /> */}
        </div>
        
        {error && (
          <div className="animate-fade-in-up delay-100" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', border: '1px solid #ef4444' }}>
            {error}
          </div>
        )}

        <div className="mobile-tabs-nav animate-fade-in-up delay-100">
          <button 
            className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`} 
            onClick={() => setActiveTab('map')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'charts' ? 'active' : ''}`} 
            onClick={() => setActiveTab('charts')}
          >
            Analytics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'updates' ? 'active' : ''}`} 
            onClick={() => setActiveTab('updates')}
          >
            Incidents
          </button>
        </div>

        <div className={`dashboard-grid active-tab-${activeTab}`}>
          <div className="dashboard-main-column">
            <div className={`tab-content map-tab ${activeTab === 'map' ? 'show' : ''} animate-fade-in-up delay-200`}>
              <MapArea routeData={routeData} routeQuery={routeQuery} isLoading={isLoading} />
            </div>
            
            <div className={`tab-content charts-tab ${activeTab === 'charts' ? 'show' : ''} animate-fade-in-up delay-300`}>
              <div className="dashboard-bottom-row">
                <Charts routeData={routeData} />
              </div>
            </div>

            <div className={`tab-content updates-tab ${activeTab === 'updates' ? 'show' : ''}`}>
              <div className="dashboard-footer-row animate-fade-in-up delay-400">
                <BottomWidgets routeData={routeData} />
              </div>
              <div className="animate-fade-in-up delay-500">
                <RouteInsights routeQuery={routeQuery} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
