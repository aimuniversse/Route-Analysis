import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import './Charts.css';

const defaultTrafficData = [
  { time: '12 AM', value: 10 },
  { time: '4 AM', value: 25 },
  { time: '8 AM', value: 65, peak: true },
  { time: '12 PM', value: 40 },
  { time: '4 PM', value: 85 },
  { time: '8 PM', value: 50 },
  { time: '12 AM', value: 15 },
];

const defaultTravelTimeData = [
  { time: '12 AM', timeVal: 450 },
  { time: '6 AM', timeVal: 480 },
  { time: '10 AM', timeVal: 560, active: true },
  { time: '12 PM', timeVal: 520 },
  { time: '2 PM', timeVal: 500 },
  { time: '4 PM', timeVal: 550 },
  { time: '6 PM', timeVal: 580 },
  { time: '8 PM', timeVal: 510 },
  { time: '12 AM', timeVal: 450 },
];

const Charts = ({ routeData }) => {
  // Use real data from backend if available
  const trafficTrends = routeData?.traffic?.trends?.length > 0 
    ? routeData.traffic.trends 
    : defaultTrafficData;

  const travelTimeData = routeData?.traffic?.travel_time_by_hour?.length > 0
    ? routeData.traffic.travel_time_by_hour.map(h => ({
        time: h.hour,
        timeVal: h.minutes,
        active: h.active
      }))
    : defaultTravelTimeData;

  const recommendedTime = routeData?.traffic?.recommended_time || { time: "10:00 AM", reason: "Optimal time to reach faster & avoid traffic." };

  const transportDist = routeData?.transport_distribution || routeData?.transport_pattern;
  const transportData = transportDist 
    ? [
        { mode: 'Bus', share: transportDist.bus || 0, active: (transportDist.bus || 0) > 40 },
        { mode: 'Train', share: transportDist.train || 0, active: (transportDist.train || 0) > 40 },
        { mode: 'Car/Private', share: transportDist.car || transportDist.private || 0, active: (transportDist.car || transportDist.private || 0) > 40 }
      ]
    : null;

  const formatTimeVal = (val) => {
    if (transportData) return `${val}%`;
    if (val >= 60) {
      const h = Math.floor(val / 60);
      const m = val % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${val} min`;
  };

  const formatTickVal = (val) => {
    if (transportData) return `${val}%`;
    return val >= 60 ? `${Math.round(val / 60)}h` : `${val}m`;
  };

  return (
    <>
      {/* Traffic Trends */}
      <div className="glass-panel chart-widget hover-lift">
        <div className="widget-header">
          <h3>Traffic Trends</h3>
          <select className="widget-select">
            <option>Today</option>
          </select>
        </div>
        <div className="chart-container" style={{ width: '100%', height: '100%', minHeight: 0, minWidth: 0 }}>
          <ResponsiveContainer width="99%" height="100%">
            <AreaChart data={trafficTrends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTrafficRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.4}/>
                  <stop offset="50%" stopColor="var(--accent-blue)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500}} tickFormatter={(val) => `${val}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderColor: 'var(--border-color)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}
                itemStyle={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}
                cursor={{ stroke: 'rgba(225, 29, 72, 0.2)', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Area type="monotone" dataKey="value" stroke="url(#colorTrafficRed)" strokeWidth={4} fillOpacity={1} fill="url(#colorTrafficRed)" activeDot={{ r: 6, fill: 'var(--accent-blue)', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dynamic Bar Chart: Travel Time OR Transport Mode Share */}
      <div className="glass-panel chart-widget hover-lift">
        <div className="widget-header">
          <h3>{transportData ? 'Transport Mode Share' : 'Travel Time by Hour'}</h3>
          <select className="widget-select">
            <option>Today</option>
          </select>
        </div>
        <div className="chart-container" style={{ width: '100%', height: '100%', minHeight: 0, minWidth: 0 }}>
          <ResponsiveContainer width="99%" height="100%">
            <BarChart data={transportData || travelTimeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey={transportData ? "mode" : "time"} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500}} dy={10} interval={0} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500}} tickFormatter={formatTickVal} />
              <Tooltip 
                cursor={{fill: 'rgba(225, 29, 72, 0.05)'}}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderColor: 'var(--border-color)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}
                itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                formatter={(value, name) => [formatTimeVal(value), transportData ? 'Share' : 'Travel Time']}
              />
              <Bar dataKey={transportData ? "share" : "timeVal"} radius={[6, 6, 0, 0]}>
                {(transportData || travelTimeData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.active ? 'url(#colorTrafficRed)' : 'var(--border-light)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommended Time */}
      <div className="glass-panel chart-widget ai-time-widget hover-lift">
        <div className="confidence-badge animate-pulse-glow">96% Confidence</div>
        <div className="widget-header">
          <h3>AI Recommended Time</h3>
        </div>
        <div className="ai-time-content">
          <div className="radial-chart">
            <svg viewBox="0 0 100 100" className="radial-svg">
              <circle cx="50" cy="50" r="45" className="radial-bg" />
              <circle cx="50" cy="50" r="45" className="radial-progress" strokeDasharray="282.6" strokeDashoffset="70" />
            </svg>
            <div className="radial-text-container">
              <span className="ai-icon">✨</span>
            </div>
          </div>
          <div className="ai-time-details">
            <div className="ai-time-label">Start at</div>
            <div className="ai-time-value">{recommendedTime.time}</div>
            <p className="ai-time-reason">{recommendedTime.reason}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Charts;
