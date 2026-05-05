import React from 'react';
import { AlertCircle, CloudRain, Clock, ArrowRight } from 'lucide-react';
import './BottomWidgets.css';

const BottomWidgets = ({ routeData }) => {
  const distance = routeData?.distance?.[0]?.km || "505";
  const startCity = routeData?.distance?.[0]?.from || "Chennai, TN";
  const endCity = routeData?.distance?.[0]?.to || "Coimbatore, TN";
  const timeMins = Math.round(Number(distance) / 60 * 60); // assuming avg 60km/h for highway

  const liveUpdates = Array.isArray(routeData?.traffic?.live_updates) 
    ? routeData.traffic.live_updates 
    : [{ incident: routeData?.traffic?.live_updates || "Normal traffic flow observed.", severity: "Low", time: "Just now" }];
  const weatherDetails = routeData?.weather || { impact: "Low", details: "Clear skies. No significant impact on travel." };

  return (
    <>
      <div className="glass-panel bottom-widget traffic-widget hover-lift">
        <div className="widget-header">
          <h3>Live Traffic Updates</h3>
          <span className="live-indicator">
            <span className="live-dot"></span> Live
          </span>
        </div>
        <div className="updates-list">
          {liveUpdates.map((update, idx) => (
            <div key={idx} className="update-item">
              <div className={`icon-circle ${update.severity === 'High' ? 'red-bg' : 'orange-bg'}`}>
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {update.severity === 'High' ? 'Critical Alert' : 'Standard Update'}
                </div>
                <div className="text-xs text-muted mt-1">{update.incident}</div>
              </div>
              <div className="text-xs font-bold text-muted">{update.time || 'Just now'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel bottom-widget hover-lift">
        <div className="widget-header">
          <h3>Weather Impact</h3>
        </div>
        <div className="update-item">
          <div className="icon-circle blue-bg">
            <CloudRain size={22} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{weatherDetails.impact} Impact</div>
              <div className="text-xl font-extrabold" style={{ color: 'var(--accent-blue)' }}>24°C</div>
            </div>
            <div className="text-xs text-muted mt-1">{weatherDetails.details}</div>
          </div>
        </div>
      </div>

      <div className="glass-panel bottom-widget hover-lift">
        <div className="widget-header">
          <h3>Recent Search</h3>
          <button className="text-accent text-xs font-bold hover:underline">View All</button>
        </div>
        <div className="update-item">
          <div className="icon-circle dark-bg">
            <Clock size={18} />
          </div>
          <div className="flex-1">
            <div className="search-route">
              <span className="city-pill">{startCity.split(',')[0]}</span> 
              <ArrowRight size={14} className="text-muted" /> 
              <span className="city-pill">{endCity.split(',')[0]}</span>
            </div>
            <div className="text-xs text-muted mt-1 font-medium">Just now</div>
          </div>
          <div className="search-stats">
            <div className="distance-value">{distance} km</div>
            <div className="time-value">{timeMins} min</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomWidgets;
