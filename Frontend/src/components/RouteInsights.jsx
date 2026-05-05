import React from 'react';
import { Users, Map, Train, Ticket, MapIcon } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, ComposedChart, Area } from 'recharts';
import './RouteInsights.css';

const RouteInsights = ({ routeQuery, routeData }) => {
  // --- Data Definitions ---

  // 1. Demographics Data
  const popData = routeData?.population_data ? [
    { name: routeData.population_data.source.name, value: (routeData.population_data.source.count / 1000000).toFixed(1), fill: 'url(#colorTrafficRed)' },
    { name: routeData.population_data.destination.name, value: (routeData.population_data.destination.count / 1000000).toFixed(1), fill: 'var(--accent-blue-light)' },
    { name: 'Via Points', value: routeData.population_data.via ? (routeData.population_data.via.count / 1000000).toFixed(1) : 0, fill: 'var(--text-muted)' },
  ].filter(d => d.value > 0) : [
    { name: 'Origin', value: 5.0, fill: 'url(#colorTrafficRed)' },
    { name: 'Dest', value: 1.7, fill: 'var(--accent-blue-light)' },
    { name: 'Corridor', value: 11.0, fill: 'var(--text-muted)' },
  ];

  // 2. Transport Data
  const transportData = routeData?.transport_distribution ? [
    { name: 'Bus', value: routeData.transport_distribution.bus, color: 'var(--accent-blue)' },
    { name: 'Train', value: routeData.transport_distribution.train, color: '#f59e0b' },
    { name: 'Car/Air', value: routeData.transport_distribution.car + (routeData.transport_distribution.flight || 0), color: '#10b981' },
  ] : [
    { name: 'Bus', value: 60, color: 'var(--accent-blue)' },
    { name: 'Train', value: 30, color: '#f59e0b' },
    { name: 'Car/Air', value: 10, color: '#10b981' },
  ];

  // 3. Tourism Data
  const tourismData = routeData?.visitor_data ? 
    routeData.visitor_data.slice(0, 5).map(v => ({ subject: v.place_name, A: v.daily })) :
    [
      { subject: 'Marina', A: 100 },
      { subject: 'Kapaleeswarar', A: 50 },
      { subject: 'Black Thunder', A: 20 },
      { subject: 'Perur Temple', A: 15 },
      { subject: 'Isha Yoga', A: 60 },
    ];

  // 4. Area Data (Segmentation)
  const areaData = routeData?.area_segmentation ? [
    { name: 'Jobs', potential: 80, activity: 90, type: routeData.area_segmentation.job_business_areas[0] || 'Business' },
    { name: 'Students', potential: 95, activity: 85, type: routeData.area_segmentation.student_areas[0] || 'Education' },
    { name: 'Tourism', potential: 70, activity: 75, type: routeData.area_segmentation.tourist_areas[0] || 'Leisure' },
  ] : [
    { name: 'Chennai', potential: 80, activity: 90, type: 'Origin / IT' },
    { name: 'Sriperumbudur', potential: 95, activity: 85, type: 'Industrial' },
    { name: 'Vellore', potential: 60, activity: 50, type: 'Education' },
    { name: 'Salem', potential: 70, activity: 65, type: 'Transit / Trade' },
    { name: 'Coimbatore', potential: 85, activity: 80, type: 'Textile' },
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
            <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.2}/>
          </linearGradient>
          <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
      </svg>

      <div className="insights-grid">
        
        {/* 1. Demographics & Distance (Bar Chart) */}
        <div className="insight-card hover-lift">
          <div className="insight-card-header">
            <div className="insight-icon red"><Users size={20} /></div>
            <h3>Demographics & Distance</h3>
          </div>
          <div className="insight-card-content" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600}} width={80} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.02)'}}
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

        {/* 2. Transport & Logistics (Donut Chart) */}
        <div className="insight-card hover-lift">
          <div className="insight-card-header">
            <div className="insight-icon blue"><Train size={20} /></div>
            <h3>Transport Share</h3>
          </div>
          <div className="insight-card-content flex items-center justify-center" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transportData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
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
          <div className="flex justify-center gap-4 text-xs font-medium">
             {transportData.map((d, i) => (
               <div key={i} className="flex items-center gap-1">
                 <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: d.color }}></div>
                 <span>{d.name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* 3. Area Segmentation (Scatter/Bubble Chart) */}
        <div className="insight-card span-2 hover-lift">
          <div className="insight-card-header">
            <div className="insight-icon orange"><Map size={20} /></div>
            <h3>Area Potential Map</h3>
          </div>
          <div className="insight-card-content" style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={areaData} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.02)'}}
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
                    <Cell key={`cell-${index}`} fill={index === 1 || index === 4 ? 'var(--accent-blue)' : 'var(--accent-blue-light)'} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-center text-muted"> Bar represents economic/tourist potential along the corridor.</div>
        </div>

        {/* 4. Tourism & Visitors (Radar Chart) */}
        <div className="insight-card hover-lift">
          <div className="insight-card-header">
            <div className="insight-icon purple"><Ticket size={20} /></div>
            <h3>Tourism Hotspots</h3>
          </div>
          <div className="insight-card-content" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={tourismData}>
                <PolarGrid stroke="rgba(0,0,0,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{fill: 'var(--text-secondary)', fontSize: 10}} />
                <Radar name="Visitors" dataKey="A" stroke="var(--purple-light)" fill="var(--purple-light)" fillOpacity={0.4} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}
                  formatter={(value) => [`${value} Index`, 'Footfall']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Suggested Routes (Graphical Timeline) */}
        <div className="insight-card hover-lift">
          <div className="insight-card-header">
            <div className="insight-icon green"><MapIcon size={20} /></div>
            <h3>Route Tradeoffs</h3>
          </div>
          <div className="insight-card-content flex flex-col justify-center gap-4" style={{ height: '200px', padding: '10px 0' }}>
             
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

      </div>
    </div>
  );
};

export default RouteInsights;
