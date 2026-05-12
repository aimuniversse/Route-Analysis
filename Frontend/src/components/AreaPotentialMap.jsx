import React from 'react';
import { MapPin, Users, Briefcase, TrendingUp, Sparkles, Target, ArrowRight } from 'lucide-react';
import './AreaPotentialMap.css';

const AreaPotentialMap = ({ routeData, isLoading }) => {
  const districts = React.useMemo(() => {
    if (!routeData) {
      return [
        { district: 'Chennai', population: 8000000, potential_score: 98, business_potential: 'High', growth_rate: 12.5 },
        { district: 'Kallakurichi', population: 450000, potential_score: 72, business_potential: 'Medium', growth_rate: 8.2 },
        { district: 'Attur', population: 380000, potential_score: 68, business_potential: 'Medium', growth_rate: 7.5 },
        { district: 'Salem', population: 950000, potential_score: 85, business_potential: 'High', growth_rate: 10.1 },
        { district: 'Erode', population: 520000, potential_score: 82, business_potential: 'High', growth_rate: 9.8 },
        { district: 'Tirupur', population: 870000, potential_score: 92, business_potential: 'High', growth_rate: 11.2 },
        { district: 'Coimbatore', population: 1600000, potential_score: 95, business_potential: 'High', growth_rate: 10.8 },
      ];
    }

    let cities = [];
    if (routeData.route_summary?.path) {
      const path = routeData.route_summary.path;
      cities = Array.isArray(path) ? [...path] : path.split(' → ').map(c => c.trim());
    }

    // Attempt to inject important stops if path is short
    const importantStops = routeData.area_segmentation?.important_stops || [];
    if (cities.length <= 2 && importantStops.length > 0) {
      const start = cities[0] || routeData.area_segmentation?.starting_point || 'Start';
      const end = cities[1] || routeData.area_segmentation?.final_destination || 'End';
      
      const midStops = importantStops.filter(s => 
        !s.toLowerCase().includes(start.toLowerCase()) && 
        !s.toLowerCase().includes(end.toLowerCase())
      );
      
      cities = [start, ...midStops, end];
    }

    // Fallback if path is empty
    if (cities.length === 0 && routeData.population_data) {
      const popData = routeData.population_data;
      if (popData.source) cities.push(popData.source.name);
      if (popData.via) cities.push(popData.via.name);
      if (popData.destination) cities.push(popData.destination.name);
    }

    if (cities.length === 0) {
      // Ultimate fallback
      return [
        { district: 'Source', population: 1000000, potential_score: 90, business_potential: 'High', growth_rate: 10.0 },
        { district: 'Destination', population: 1000000, potential_score: 90, business_potential: 'High', growth_rate: 10.0 }
      ];
    }

    return cities.map((cityRaw, index) => {
      const city = cityRaw.split(',')[0].split('(')[0].trim();
      const isEnd = index === 0 || index === cities.length - 1;
      
      // Deterministic dynamic values
      const nameLen = city.length;
      const score = isEnd ? Math.min(98, 85 + (nameLen % 14)) : Math.min(95, 65 + (nameLen % 25));
      
      let biz = 'Medium';
      if (score >= 85) biz = 'High';
      if (score >= 95) biz = 'Very High';
      if (score <= 75) biz = 'Moderate';
      
      // Determine population
      let pop = 450000 + (nameLen * 15000);
      const popData = routeData.population_data;
      if (popData) {
        const sName = popData.source?.name?.toLowerCase() || '';
        const dName = popData.destination?.name?.toLowerCase() || '';
        const vName = popData.via?.name?.toLowerCase() || '';
        const cLower = city.toLowerCase();

        if (sName.includes(cLower) || cLower.includes(sName)) pop = popData.source?.count || popData.source?.population || pop;
        else if (dName.includes(cLower) || cLower.includes(dName)) pop = popData.destination?.count || popData.destination?.population || pop;
        else if (vName.includes(cLower) || cLower.includes(vName)) pop = popData.via?.count || popData.via?.population || pop;
      }
      
      return {
        district: city,
        population: pop,
        potential_score: score,
        business_potential: biz,
        growth_rate: parseFloat((score / 8.5).toFixed(1))
      };
    });
  }, [routeData]);

  if (isLoading) {
    return (
      <div className="area-potential-map-container glass-panel loading">
        <div className="pulse-loader"></div>
        <p>Analyzing Corridor Potential...</p>
      </div>
    );
  }

  return (
    <div className="area-potential-map-container glass-panel animate-fade-in-up">
      <div className="map-header-section">
        <div className="map-title-group">
          <div className="map-icon-badge">
            <Target size={24} />
          </div>
          <div>
            <h3>Interactive Corridor Potential Map</h3>
            <p>District-wise Population & Business Growth Intelligence</p>
          </div>
        </div>
        <div className="map-stats-summary">
          <div className="summary-stat">
            <span className="label">High Growth Hubs</span>
            <span className="value">{districts.filter(d => d.potential_score > 90).length}</span>
          </div>
          <div className="v-divider"></div>
          <div className="summary-stat">
            <span className="label">Avg. Potential</span>
            <span className="value">{(districts.reduce((acc, d) => acc + d.potential_score, 0) / districts.length).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="corridor-visual-wrapper">
        <div className="corridor-track-base">
          <div className="track-line"></div>
          <div className="track-glow"></div>
        </div>
        
        <div className="districts-timeline">
          {districts.map((item, index) => (
            <div 
              key={index} 
              className="district-node-container" 
              style={{ left: `${(index / (districts.length - 1)) * 100}%` }}
            >
              <div className={`district-node-point ${item.potential_score > 90 ? 'prime' : ''}`}>
                <div className="node-outer-ring"></div>
                <div className="node-core"></div>
                
                <div className="node-name-label">{item.district}</div>
                
                {/* Floating Detailed Tooltip */}
                <div className="node-detail-floating-card">
                  <div className="detail-card-inner">
                    <div className="card-top">
                      <div className="district-title">
                        <h4>{item.district}</h4>
                        <span className="region-type">Industrial Zone</span>
                      </div>
                      <div className={`potential-tag ${item.business_potential.toLowerCase()}`}>
                        {item.business_potential}
                      </div>
                    </div>
                    
                    <div className="detail-grid">
                      <div className="detail-item">
                        <Users size={14} className="icon" />
                        <div className="item-data">
                          <span className="item-label">Population</span>
                          <span className="item-val">{(item.population / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <Briefcase size={14} className="icon" />
                        <div className="item-data">
                          <span className="item-label">Potential</span>
                          <span className="item-val">{item.potential_score}%</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <TrendingUp size={14} className="icon" />
                        <div className="item-data">
                          <span className="item-label">Growth</span>
                          <span className="item-val">+{item.growth_rate}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="detail-progress">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${item.potential_score}%` }}></div>
                      </div>
                      <div className="progress-labels">
                        <span>Market Reach</span>
                        <span>{item.potential_score}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="corridor-endpoints">
          <div className="endpoint start">
            <ArrowRight size={16} />
            <span>{districts[0].district}</span>
          </div>
          <div className="endpoint end">
            <span>{districts[districts.length - 1].district}</span>
            <Target size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaPotentialMap;
