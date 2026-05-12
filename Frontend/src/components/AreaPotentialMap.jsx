import React, { useMemo } from 'react';
import { MapPin, Users, Briefcase, TrendingUp, Sparkles, Target, ArrowRight } from 'lucide-react';
import './AreaPotentialMap.css';

const AreaPotentialMap = ({ routeData, isLoading }) => {
  // Extract data from backend with dynamic mapping
  const districts = useMemo(() => {
    if (!routeData) return [];
    
    const demand = routeData.demand_distribution || [];
    const source = routeData.population_data?.source;
    const dest = routeData.population_data?.destination;
    
    let nodes = [];
    
    // Add source if exists
    if (source) {
      nodes.push({
        district: source.name,
        population: source.population,
        potential_score: 95,
        business_potential: 'High',
        growth_rate: 10.5
      });
    }
    
    // Add demand distribution cities as intermediate hubs
    demand.forEach(state => {
      if (state.top_cities) {
        state.top_cities.forEach(city => {
          if (city.name !== source?.name && city.name !== dest?.name) {
            nodes.push({
              district: city.name,
              population: (city.visitor_count || 0) * 12,
              potential_score: Math.min(95, (city.percentage || 10) * 4),
              business_potential: (city.percentage || 0) > 15 ? 'High' : 'Medium',
              growth_rate: ((city.percentage || 10) / 1.8).toFixed(1)
            });
          }
        });
      }
    });
    
    // Add destination
    if (dest && !nodes.find(n => n.district === dest.name)) {
      nodes.push({
        district: dest.name,
        population: dest.population,
        potential_score: 92,
        business_potential: 'High',
        growth_rate: 9.8
      });
    }
    
    // De-duplicate and limit to keep the visual clean
    const unique = Array.from(new Set(nodes.map(n => n.district)))
      .map(name => nodes.find(n => n.district === name))
      .slice(0, 8); // Max 8 nodes for visual clarity
      
    return unique;
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
