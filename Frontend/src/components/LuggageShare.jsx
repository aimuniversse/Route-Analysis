import React, { useState, useEffect } from 'react';
import {
  Package, Truck, Clock, ArrowRight, ArrowLeftRight,
  TrendingUp, Loader2, RefreshCw, AlertCircle,
  Bus, Train, Car, Briefcase
} from 'lucide-react';
import './LuggageShare.css';

// Cache so re-renders don't re-fetch
const luggageCache = {};

const ModeIcon = ({ mode, size = 16 }) => {
  switch (mode?.toLowerCase()) {
    case 'train':  return <Train size={size} />;
    case 'bus':    return <Bus size={size} />;
    case 'courier':return <Briefcase size={size} />;
    case 'taxi':   return <Car size={size} />;
    default:       return <Truck size={size} />;
  }
};

const modeColor = (mode) => {
  switch (mode?.toLowerCase()) {
    case 'train':   return { bg: '#dbeafe', text: '#1d4ed8' };
    case 'bus':     return { bg: '#dcfce7', text: '#15803d' };
    case 'courier': return { bg: '#ffedd5', text: '#c2410c' };
    case 'taxi':    return { bg: '#f3e8ff', text: '#7e22ce' };
    default:        return { bg: '#f1f5f9', text: '#475569' };
  }
};

export default function LuggageShare({ sourceName, destName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cacheKey = `${sourceName}||${destName}`;

  const fetchData = async () => {
    if (!sourceName || !destName) return;
    if (luggageCache[cacheKey]) { setData(luggageCache[cacheKey]); return; }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8000/api/luggage-share/?source=${encodeURIComponent(sourceName)}&destination=${encodeURIComponent(destName)}`
      );
      if (!res.ok) throw new Error('Network error');
      const json = await res.json();
      if (json.status === 'success') {
        luggageCache[cacheKey] = json.data;
        setData(json.data);
      } else {
        throw new Error(json.message || 'Failed to fetch');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData(null);
    setError(null);
    fetchData();
  }, [sourceName, destName]);

  return (
    <div className="ls-card">
      {/* ── Header ── */}
      <div className="ls-header">
        <div className="ls-header-left">
          <div className="ls-icon-badge">
            <Package size={20} />
          </div>
          <div>
            <h3 className="ls-title">Luggage &amp; Parcel Share</h3>
            <p className="ls-subtitle">
              {sourceName} &nbsp;<ArrowLeftRight size={13} className="ls-arrow-mid" />&nbsp; {destName}
            </p>
          </div>
        </div>
        <button
          className="ls-refresh-btn"
          onClick={() => { luggageCache[cacheKey] = undefined; fetchData(); }}
          title="Refresh data"
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'ls-spin' : ''} />
        </button>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="ls-loading">
          <Loader2 size={22} className="ls-spin" />
          <span>Fetching logistics data from AI…</span>
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className="ls-error">
          <AlertCircle size={16} />
          <span>Could not load luggage data. <button className="ls-retry" onClick={fetchData}>Retry</button></span>
        </div>
      )}

      {/* ── Data ── */}
      {data && !loading && (
        <div className="ls-body">

          {/* ── KPI row ── */}
          <div className="ls-kpi-row">
            <div className="ls-kpi">
              <div className="ls-kpi-icon blue"><Package size={16} /></div>
              <div>
                <div className="ls-kpi-value">{data.total_parcels_daily?.toLocaleString()}</div>
                <div className="ls-kpi-label">Parcels / Day</div>
              </div>
            </div>
            <div className="ls-kpi">
              <div className="ls-kpi-icon orange"><TrendingUp size={16} /></div>
              <div>
                <div className="ls-kpi-value">{data.avg_weight_kg} kg</div>
                <div className="ls-kpi-label">Avg Weight</div>
              </div>
            </div>
            <div className="ls-kpi">
              <div className="ls-kpi-icon green"><Clock size={16} /></div>
              <div>
                <div className="ls-kpi-value">
                  {data.delivery_time_hours?.min}–{data.delivery_time_hours?.max}h
                </div>
                <div className="ls-kpi-label">Delivery Time</div>
              </div>
            </div>
            <div className="ls-kpi">
              <div className="ls-kpi-icon purple"><Briefcase size={16} /></div>
              <div>
                <div className="ls-kpi-value">
                  ₹{data.price_range_inr?.min}–{data.price_range_inr?.max}
                </div>
                <div className="ls-kpi-label">Price Range</div>
              </div>
            </div>
          </div>

          {/* ── Volume flow bar ── */}
          <div className="ls-flow-section">
            <div className="ls-flow-labels">
              <span className="ls-flow-city">{sourceName}</span>
              <ArrowRight size={14} className="ls-flow-arr" />
              <span className="ls-flow-city">{destName}</span>
            </div>
            <div className="ls-flow-bar-wrap">
              <div
                className="ls-flow-fill src"
                style={{ width: `${data.source_to_dest_volume ?? 50}%` }}
              >
                <span>{data.source_to_dest_volume ?? 50}%</span>
              </div>
              <div
                className="ls-flow-fill dst"
                style={{ width: `${data.dest_to_source_volume ?? 50}%` }}
              >
                <span>{data.dest_to_source_volume ?? 50}%</span>
              </div>
            </div>
            <div className="ls-flow-legend">
              <span><span className="ls-dot src-dot" />{sourceName} → {destName}</span>
              <span><span className="ls-dot dst-dot" />{destName} → {sourceName}</span>
            </div>
          </div>

          <div className="ls-split">
            {/* ── Top Carriers ── */}
            <div className="ls-carriers">
              <h4 className="ls-section-title"><Truck size={14} /> Top Carriers</h4>
              <div className="ls-carrier-list">
                {data.top_carriers?.map((c, i) => {
                  const col = modeColor(c.mode);
                  return (
                    <div key={i} className="ls-carrier-row">
                      <div className="ls-carrier-left">
                        <div className="ls-carrier-icon" style={{ background: col.bg, color: col.text }}>
                          <ModeIcon mode={c.mode} size={14} />
                        </div>
                        <span className="ls-carrier-name">{c.name}</span>
                        <span className="ls-carrier-mode" style={{ background: col.bg, color: col.text }}>
                          {c.mode}
                        </span>
                      </div>
                      <div className="ls-carrier-right">
                        <div className="ls-carrier-bar-track">
                          <div
                            className="ls-carrier-bar-fill"
                            style={{ width: `${c.share_percent}%`, background: col.text }}
                          />
                        </div>
                        <span className="ls-carrier-pct">{c.share_percent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Right side: Popular items + Peak hours ── */}
            <div className="ls-right-col">
              {/* Popular items */}
              <div className="ls-items-box">
                <h4 className="ls-section-title"><Package size={14} /> Popular Items</h4>
                <div className="ls-items-list">
                  {data.popular_items?.map((item, i) => (
                    <span key={i} className="ls-item-chip">{item}</span>
                  ))}
                </div>
              </div>

              {/* Peak hours */}
              <div className="ls-peak-box">
                <h4 className="ls-section-title"><Clock size={14} /> Peak Hours</h4>
                <div className="ls-peak-list">
                  {data.peak_hours?.map((h, i) => (
                    <div key={i} className="ls-peak-row">
                      <Clock size={12} className="ls-peak-icon" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
