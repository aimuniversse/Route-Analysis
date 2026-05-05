import React from 'react';
import '../styles/results.css';

const RouteResults = ({ data, onBack }) => {
    if (!data) return null;

    return (
        <div className="results-page animate-fade">
            <header className="results-header">
                <button className="back-btn" onClick={onBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Search
                </button>
                <h1>AI Route Analysis <span>Report</span></h1>
                <p className="summary-path">{data.route_summary.path}</p>
            </header>

            <div className="results-grid">
                {/* 1. Quick Stats */}
                <section className="results-section quick-stats">
                    <div className="stat-card">
                        <div className="stat-icon">📏</div>
                        <div className="stat-info">
                            <label>Total Distance</label>
                            <div className="value">{data.route_summary.total_distance} km</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-info">
                            <label>Est. Time</label>
                            <div className="value">{data.route_summary.estimated_time} hrs</div>
                        </div>
                    </div>
                </section>

                {/* 2. Population Data */}
                <section className="results-section">
                    <h3>Population Data</h3>
                    <div className="pop-grid">
                        <div className="pop-item">
                            <span className="city">{data.population_data.source.name}</span>
                            <span className="count">{data.population_data.source.count.toLocaleString()}</span>
                        </div>
                        {data.population_data.via && (
                            <div className="pop-item">
                                <span className="city">{data.population_data.via.name} (Via)</span>
                                <span className="count">{data.population_data.via.count.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="pop-item">
                            <span className="city">{data.population_data.destination.name}</span>
                            <span className="count">{data.population_data.destination.count.toLocaleString()}</span>
                        </div>
                    </div>
                </section>

                {/* 3. Area Segmentation */}
                <section className="results-section">
                    <h3>Area Segmentation</h3>
                    <div className="segment-cards">
                        <div className="segment-card job">
                            <h4>Business & Jobs</h4>
                            <ul>
                                {data.area_segmentation.job_business_areas.map((area, i) => <li key={i}>{area}</li>)}
                            </ul>
                        </div>
                        <div className="segment-card student">
                            <h4>Educational Hubs</h4>
                            <ul>
                                {data.area_segmentation.student_areas.map((area, i) => <li key={i}>{area}</li>)}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 4. Transport Distribution */}
                <section className="results-section">
                    <h3>Transport Distribution</h3>
                    <div className="transport-chart">
                        {Object.entries(data.transport_distribution).map(([mode, percentage]) => (
                            <div key={mode} className="chart-row">
                                <label>{mode.charAt(0).toUpperCase() + mode.slice(1)}</label>
                                <div className="bar-container">
                                    <div className="bar" style={{ width: `${percentage}%` }}></div>
                                    <span className="percentage">{percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Suggested Routes */}
                <section className="results-section full-width">
                    <h3>AI Suggested Routes</h3>
                    <div className="route-options">
                        {data.suggested_routes.map((route, i) => (
                            <div key={i} className="route-option-card">
                                <div className="option-num">Option {route.option}</div>
                                <div className="option-path">{route.path}</div>
                                <div className="option-meta">
                                    <span>{route.distance} km</span>
                                    <span>{route.time} hours</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RouteResults;
