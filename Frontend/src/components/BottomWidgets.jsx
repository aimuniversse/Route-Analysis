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
      <div className="glass-panel bottom-widget traffic-widget">
        <div className="widget-header">
          <h3>Live Traffic Updates</h3>
          <span className="live-indicator">
            <span className="live-dot"></span> Live
          </span>
        </div>
        <div className="updates-list">
          {liveUpdates.map((update, idx) => (
            <div key={idx} className="widget-content flex items-center gap-4 mt-2 update-item">
              <div className={`icon-circle ${update.severity === 'High' ? 'red-bg' : 'orange-bg'}`} style={{minWidth: '36px'}}>
                <AlertCircle size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{routeData ? 'Route Incident' : 'Status'}</div>
                <div className="text-xs text-muted mt-1">{update.incident}</div>
              </div>
              <div className="text-xs text-muted whitespace-nowrap">{update.time || 'Just now'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel bottom-widget">
        <div className="widget-header">
          <h3>Weather Impact</h3>
        </div>
        <div className="widget-content flex items-center gap-4 mt-2">
          <div className="icon-circle blue-bg">
            <CloudRain size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">{weatherDetails.impact} Impact</div>
              <div className="text-accent text-sm font-medium">24°C</div>
            </div>
            <div className="text-xs text-muted mt-1">{weatherDetails.details}</div>
          </div>
        </div>
      </div>

      <div className="glass-panel bottom-widget">
        <div className="widget-header">
          <h3>Recent Search</h3>
          <button className="text-accent text-xs font-medium">View All</button>
        </div>
        <div className="widget-content flex items-center gap-4 mt-2">
          <div className="icon-circle dark-bg">
            <Clock size={16} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium flex items-center gap-2">
              <span className="truncate">{startCity}</span> 
              <ArrowRight size={12} className="text-muted flex-shrink-0" /> 
              <span className="truncate">{endCity}</span>
            </div>
            <div className="text-xs text-muted mt-1">Today, Just now</div>
          </div>
          <div className="text-right whitespace-nowrap">
            <div className="text-sm font-medium">{distance} km</div>
            <div className="text-xs text-success mt-1">{timeMins} min</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomWidgets;
