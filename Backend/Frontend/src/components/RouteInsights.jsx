import React from 'react';
import { Users, Map, Train, Ticket, MapIcon } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, ComposedChart, Area } from 'recharts';
import './RouteInsights.css';

const RouteInsights = ({ routeQuery, routeData }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    // Delay rendering charts until layout is stable
    const timer = setTimeout(() => setIsMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return <div className="route-insights-container glass-panel mt-4" style={{ minHeight: '400px' }} />;
  // --- Data Definitions ---

  // 1. Demographics Data
  const aiPop = routeData?.population_data;
  const popData = aiPop ? [
    { name: aiPop.source?.name || 'Origin', value: aiPop.source?.count / 1000000 || 0, fill: 'url(#colorTrafficRed)' },
    { name: aiPop.destination?.name || 'Destination', value: aiPop.destination?.count / 1000000 || 0, fill: 'var(--accent-blue-light)' },
    ...(aiPop.via ? [{ name: aiPop.via.name || 'Via', value: aiPop.via.count / 1000000 || 0, fill: 'var(--text-muted)' }] : [])
  ] : [];

  // 2. Transport Data
  const aiTransport = routeData?.transport_distribution || routeData?.transport_pattern;
  const transportData = aiTransport ? Object.entries(aiTransport).map(([key, value]) => {
    const transportColors = {
      bus: 'var(--accent-blue)',
      train: '#f59e0b',
      car: '#10b981',
      flight: '#10b981',
      private: '#10b981',
      taxi: '#10b981'
    };

    const transportNames = {
      bus: 'Bus',
      train: 'Train',
      car: 'Car',
      flight: 'Flight',
      private: 'Private',
      taxi: 'Taxi'
    };

    // Group car-related modes into Car/Air
    if (['car', 'flight', 'private', 'taxi'].includes(key.toLowerCase())) {
      return null; // Will be handled separately
    }

    return {
      name: transportNames[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1),
      value: value || 0,
      color: transportColors[key.toLowerCase()] || 'var(--accent-blue)'
    };
  }).filter(Boolean).concat([
    // Add combined Car/Air category
    {
      name: 'Car/Air',
      value: (aiTransport.car || 0) + (aiTransport.flight || 0) + (aiTransport.private || 0) + (aiTransport.taxi || 0),
      color: '#10b981'
    }
  ]).filter(item => item.value > 0) : [
    { name: 'Bus', value: 60, color: 'var(--accent-blue)' },
    { name: 'Train', value: 30, color: '#f59e0b' },
    { name: 'Car/Air', value: 10, color: '#10b981' },
  ];

  // 3. Tourism Data
  const aiTourism = routeData?.visitor_data;
  const tourismData = aiTourism ? aiTourism.slice(0, 5).map(v => ({
    subject: v.place_name, A: v.daily || Math.round(v.yearly / 365) || 0
  })) : [];

  // 4. Area Data (Segmentation)
  const aiArea = routeData?.area_segmentation;
  const areaData = aiArea ? [
    {
      name: aiArea.business_areas?.[0]?.name || 'Business',
      potential: aiArea.business_areas?.[0]?.potential || 90,
      activity: aiArea.business_areas?.[0]?.activity || 85,
      type: aiArea.business_areas?.[0]?.type || 'Jobs'
    },
    {
      name: aiArea.student_areas?.[0]?.name || 'Student',
      potential: aiArea.student_areas?.[0]?.potential || 60,
      activity: aiArea.student_areas?.[0]?.activity || 50,
      type: aiArea.student_areas?.[0]?.type || 'Education'
    },
    {
      name: aiArea.tourist_areas?.[0]?.name || 'Tourist',
      potential: aiArea.tourist_areas?.[0]?.potential || 85,
      activity: aiArea.tourist_areas?.[0]?.activity || 80,
      type: aiArea.tourist_areas?.[0]?.type || 'Leisure'
    },
  ] : [
    { name: 'Business', potential: 90, activity: 85, type: 'Jobs' },
    { name: 'Student', potential: 60, activity: 50, type: 'Education' },
    { name: 'Tourist', potential: 85, activity: 80, type: 'Leisure' },
  ];

  const suggestedRoutes = routeData?.suggested_routes || [
    { option: 1, path: 'NH 544', distance: 505, time: 8.5 },
    { option: 2, path: 'NH 48', distance: 530, time: 9.7 },
  ];

  // --- Render ---

  return (
    <div className="route-insights-container glass-panel mt-4">
      <div className="insights-header">
        <h2 className="insights-title">Route Insights: {routeQuery}</h2>
        <span className="badge live-data">Premium Analysis</span>
      </div>

      {/* SVG Defs for Gradients used in Charts */}
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          <linearGradient id="colorTrafficRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
          </linearGradient>
        </defs>
      </svg>

      <div className="insights-grid">

        {/* 1. Demographics & Distance (Bar Chart) */}
        {popData.length > 0 && (
        <div className="insight-card hover-lift">
          <div className="insight-card-header">
            <div className="insight-icon red"><Users size={20} /></div>
            <h3>Demographics & Distance</h3>
          </div>
          <div className="insight-card-content" style={{ width: '100%', minWidth: '0px' }}>
            <ResponsiveContainer width="100%" aspect={1.6}>
              <BarChart data={popData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }} width={80} />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}
                  formatter={(value) => [`${value} Million`, 'Population']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                  {popData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Primary Route (NH 544)</span>
              <span className="font-bold text-primary">505 KM</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-muted">Alternative (NH 48)</span>
              <span className="font-medium text-secondary">530 KM</span>
            </div>
          </div>
        </div>
        )}

        {/* 2. Transport & Logistics (Donut Chart) */}
        {transportData.length > 0 && (
        <div className="insight-card hover-lift">
          <div className="insight-card-header">
            <div className="insight-icon blue"><Train size={20} /></div>
            <h3>Transport Share</h3>
          </div>
          <div className="insight-card-content flex items-center justify-center" style={{ width: '100%', minWidth: '0px' }}>
            <ResponsiveContainer width="100%" aspect={1.6}>
              <PieChart>
                <Pie
                  data={transportData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {transportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}
                  formatter={(value) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center gap-6 text-xs font-medium flex-nowrap" style={{ flexWrap: 'nowrap' }}>
            {transportData.map((d, i) => (
              <div key={i} className="flex items-center gap-1 whitespace-nowrap">
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: d.color, flexShrink: 0 }}></div>
                <span className="font-medium">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* 3. Area Segmentation (Scatter/Bubble Chart) */}
        {areaData.length > 0 && (
        <div className="insight-card span-2 hover-lift">
          <div className="insight-card-header">
            <div className="insight-icon orange"><Map size={20} /></div>
            <h3>Area Potential Sectors</h3>
          </div>
          <div className="insight-card-content" style={{ width: '100%', minWidth: '0px' }}>
            <ResponsiveContainer width="100%" aspect={3.5}>
              <ComposedChart data={areaData} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }} dy={10} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}
                  formatter={(value, name, props) => {
                    if (name === 'potential') return [value, 'Economic Potential'];
                    if (name === 'activity') return [value, 'Activity Level'];
                    return [value, name];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return `${label} (${payload[0].payload.type})`;
                    }
                    return label;
                  }}
                />
                <Area type="monotone" dataKey="activity" fill="url(#colorArea)" stroke="#f59e0b" strokeWidth={2} />
                <Bar dataKey="potential" barSize={30} radius={[6, 6, 0, 0]}>
                  {areaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 || index === 4 ? '#e11d48' : '#dc2626'} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-center text-muted"> Bar represents economic/tourist potential along the corridor.</div>
        </div>
        )}

        {/* 4. Tourism & Visitors (Radar Chart) */}
        {tourismData.length > 0 && (
        <div className="insight-card hover-lift">
          <div className="insight-card-header">
            <div className="insight-icon purple"><Ticket size={20} /></div>
            <h3>Tourism Hotspots</h3>
          </div>
          <div className="insight-card-content" style={{ width: '100%', minWidth: '0px' }}>
            <ResponsiveContainer width="100%" aspect={1.6}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={tourismData}>
                <PolarGrid stroke="rgba(0,0,0,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <Radar name="Visitors" dataKey="A" stroke="var(--purple-light)" fill="var(--purple-light)" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}
                  formatter={(value) => [`${value} Index`, 'Footfall']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        )}

        {/* 5. Suggested Routes (Graphical Timeline) */}
        {suggestedRoutes.length > 0 && (
        <div className="insight-card hover-lift">
          <div className="insight-card-header">
            <div className="insight-icon green"><MapIcon size={20} /></div>
            <h3>Route Tradeoffs</h3>
          </div>
          <div className="insight-card-content flex flex-col justify-center gap-4" style={{ minHeight: '160px', padding: '10px 0' }}>

            {suggestedRoutes.map((route, idx) => (
              <div key={idx} className="w-full">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold">{route.path} {idx === 0 ? '(Optimal)' : ''}</span>
                  <span className="font-semibold text-primary">{Math.floor(route.time)}h {Math.round((route.time % 1) * 60)}m</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: idx === 0 ? '85%' : '95%', background: idx === 0 ? 'var(--gradient-primary)' : '#f59e0b' }}></div>
                </div>
                <div className="text-[10px] text-muted mt-1">{route.distance} KM • Detailed Analysis Avail.</div>
              </div>
            ))}

          </div>
        </div>
        )}

      </div>
    </div>
  );
};

export default RouteInsights;
