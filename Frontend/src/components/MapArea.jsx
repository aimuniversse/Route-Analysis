import React, { useState } from 'react';
import { Loader2, Maximize2, Minimize2, Map as MapIcon, Navigation } from 'lucide-react';
import './MapArea.css';
import routeMap from "../assets/routemap.png";

const MapArea = ({ routeData, routeQuery, isLoading }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const parsedPath = routeData?.route_summary?.path?.split(" → ") || routeQuery?.split(" to ");
  const startLabel = parsedPath?.[0] || 'Origin';
  const endLabel = parsedPath?.[parsedPath.length - 1] || 'Destination';

  return (
    <div className={`route-map-shell ${isFullscreen ? 'fullscreen-active' : ''}`}>
      <div className={`route-map-card ${isFullscreen ? 'fullscreen-card' : ''}`}>
        <div className="route-map-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'rgba(225, 29, 72, 0.1)', 
              padding: '10px', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-red, #e11d48)'
            }}>
              <MapIcon size={22} />
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: '2px', opacity: 0.7 }}>Premium Route Analysis</p>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {startLabel} 
                <ArrowIcon /> 
                {endLabel}
              </h2>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className="route-chip" style={{ 
              background: 'var(--bg-panel)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-color)',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Navigation size={14} />
              Live Overview
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="fullscreen-toggle"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        <div className="route-map-frame" style={{ height: isFullscreen ? '100%' : '650px' }}>
          <div className="static-map-container">
            <img 
              src={routeMap} 
              alt={`Route visualization from ${startLabel} to ${endLabel}`} 
              className="static-map-image"
              style={{ 
                objectFit: 'cover', 
                width: '100%', 
                height: '100%',
                opacity: isLoading ? 0.3 : 1,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isLoading ? 'scale(1.05)' : 'scale(1)'
              }}
            />
          </div>

          {isLoading && (
            <div className="loading-overlay" style={{ background: 'rgba(2, 6, 23, 0.5)', backdropFilter: 'blur(4px)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Loader2 className="spinner" style={{ color: '#fff' }} />
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em' }}>SYNCING GEODATA...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default MapArea;
