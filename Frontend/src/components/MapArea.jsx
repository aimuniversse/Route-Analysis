import React, { useState } from 'react';
import { Loader2, Maximize2, Minimize2, Map as MapIcon, Navigation } from 'lucide-react';
import './MapArea.css';
import routeMap from "../assets/image/maparea.png";

const MapArea = ({ routeData, routeQuery, isLoading }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const routePath = routeData?.route_summary?.path || routeQuery;
  const parsedPath = routePath?.includes(' → ')
    ? routePath.split(' → ').map(c => c.trim())
    : routePath?.includes(' to ')
      ? routePath.split(' to ').map(c => c.trim())
      : [routePath?.trim()];

  const startLabel = parsedPath?.[0] || routeData?.population_data?.source?.name || 'Origin';
  const endLabel = parsedPath?.[parsedPath.length - 1] || routeData?.population_data?.destination?.name || 'Destination';
  const viaName = parsedPath?.length === 3 ? parsedPath[1] : routeData?.population_data?.via?.name;

  const sourceName = routeData?.population_data?.source?.name || startLabel;
  const destName = routeData?.population_data?.destination?.name || endLabel;

  const sourcePosition = { left: 88.5, top: 8.2 };
  const viaPosition = { left: 50, top: 45 };
  const destPosition = { left: 17.6, top: 94 };

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
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', margin: 0 }}>
                {parsedPath?.join(' → ')}
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
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '999px'
            }}>
              <Navigation size={14} />
              <span>{viaName ? `Via ${viaName}` : 'Direct Corridor'}</span>
            </div>
          </div>
        </div>

        <div className="route-map-frame" style={{ height: isFullscreen ? '100%' : '650px' }}>
          {/* Route Summary Table - Left Top */}
          {!isLoading && routeData?.route_summary && (
            <div className="route-summary-table" style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(237, 238, 243, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '16px',
              zIndex: 10,
              minWidth: '200px'
            }}>
              <h4 style={{
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                Route Summary
              </h4>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.85rem'
              }}>
                <tbody>
                  <tr>
                    <td style={{
                      color: 'var(--text-muted)',
                      padding: '4px 0',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      From
                    </td>
                    <td style={{
                      color: 'var(--accent-red)',
                      padding: '4px 0',
                      textAlign: 'right',
                      fontWeight: '600',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      {sourceName?.length > 10 ? `${sourceName.substring(0, 10)}...` : sourceName}
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      color: 'var(--text-muted)',
                      padding: '4px 0',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      To
                    </td>
                    <td style={{
                      color: 'var(--accent-red)',
                      padding: '4px 0',
                      textAlign: 'right',
                      fontWeight: '600',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      {destName?.length > 10 ? `${destName.substring(0, 10)}...` : destName}
                    </td>
                  </tr>
                  {viaName && (
                  <tr>
                    <td style={{
                      color: 'var(--text-muted)',
                      padding: '4px 0',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      Via
                    </td>
                    <td style={{
                      color: 'var(--accent-orange, #f59e0b)',
                      padding: '4px 0',
                      textAlign: 'right',
                      fontWeight: '600',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      {viaName?.length > 10 ? `${viaName.substring(0, 10)}...` : viaName}
                    </td>
                  </tr>
                  )}
                  <tr>
                    <td style={{
                      color: 'var(--text-muted)',
                      padding: '4px 0',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      Distance
                    </td>
                    <td style={{
                      color: 'var(--accent-blue)',
                      padding: '4px 0',
                      textAlign: 'right',
                      fontWeight: '600',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      {routeData.route_summary.total_distance || 'N/A'} km
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      color: 'var(--text-muted)',
                      padding: '4px 0'
                    }}>
                      Est. Time
                    </td>
                    <td style={{
                      color: 'var(--accent-green)',
                      padding: '4px 0',
                      textAlign: 'right',
                      fontWeight: '600'
                    }}>
                      {routeData.route_summary.estimated_time || 'N/A'} hrs
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

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
            
            {!isLoading && sourcePosition && destPosition && (
              <div className="map-markers-overlay">
                <div className="map-marker source" style={{ left: `${sourcePosition.left}%`, top: `${sourcePosition.top}%` }}>
                  <div className="marker-icon-container">
                    {/*<div className="marker-pin source-pin" />*/}
                  </div>
                  <div className="marker-label source-label">{sourceName || 'Source'}</div>
                </div>

                {viaName && (
                <div className="map-marker via" style={{ left: `${viaPosition.left}%`, top: `${viaPosition.top}%` }}>
                  <div className="marker-icon-container via">
                    {/*<div className="marker-pin via-pin" />*/}
                  </div>
                  <div className="marker-label via-label">{viaName}</div>
                </div>
                )}
                
                <div className="map-marker destination" style={{ left: `${destPosition.left}%`, top: `${destPosition.top}%` }}>
                  <div className="marker-icon-container destination">
                    {/*<div className="marker-pin dest-pin" />*/}
                  </div>
                  <div className="marker-label dest-label">{destName || 'Destination'}</div>
                </div>
              </div>
            )}
            
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
