import React, { useMemo } from 'react';
import {
  Package, Truck, Clock, ArrowRight, ArrowLeftRight,
  Bus, Train, Car, Briefcase, BarChart2, MapPin, CheckCircle2
} from 'lucide-react';
import './LuggageShare.css';

// ── Helpers ──────────────────────────────────────────────────────────────────
const ModeIcon = ({ mode, size = 16 }) => {
  switch (mode?.toLowerCase()) {
    case 'train':   return <Train size={size} />;
    case 'bus':     return <Bus size={size} />;
    case 'courier': return <Briefcase size={size} />;
    case 'taxi':    return <Car size={size} />;
    default:        return <Truck size={size} />;
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

// ── Main Component ────────────────────────────────────────────────────────────
export default function LuggageShare({ routeData, sourceName, destName }) {

  // ── Derive everything inside ONE memo keyed on routeData ─────────────────
  const {
    carriers,
    totalBusTrips,
    totalTrainTrips,
    totalTrips,
    modesUsed,
    srcToDest,
    dstToSrc,
    legs,
    hasData,
  } = useMemo(() => {
    const logistics = routeData?.logistics_services || {};
    
    // The backend structure might have keys directly in logistics_services or in parcel_movement
    const hasDirectKeys = ['bus', 'train', 'courier', 'taxi'].some(k => k in logistics);
    const parcel    = hasDirectKeys ? logistics : (logistics.parcel_movement || {});
    const modes     = logistics.modes_used || (hasDirectKeys ? Object.keys(logistics).filter(k => Number(logistics[k]) > 0) : []);
    
    const schedule  = routeData?.transport_schedule || [];
    const distrib   = routeData?.transport_distribution || {};

    // Carrier rows from parcel data
    const carrierList = Object.entries(parcel)
      .filter(([mode, v]) => ['bus', 'train', 'courier', 'taxi', 'truck'].includes(mode.toLowerCase()) && Number(v) > 0)
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .map(([mode, share]) => ({
        mode,
        name: mode.charAt(0).toUpperCase() + mode.slice(1),
        share_percent: Number(share),
      }));

    // Trip totals from schedule
    const busTrips   = schedule.reduce((s, r) => s + (Number(r.trips_per_day || r.bus_trips)   || 0), 0);
    const trainTrips = schedule.reduce((s, r) => s + (Number(r.trips_per_day || r.train_trips) || 0), 0);

    // Direction volumes
    const src = Math.round((Number(distrib.bus) || 0) + (Number(distrib.train) || 0));
    const dst = Math.min(100, 100 - src);

    // Route legs
    const legList = schedule.map(leg => ({
      from:  leg.from,
      to:    leg.to,
      bus:   leg.type === 'bus' ? leg.trips_per_day : (leg.bus_trips || 0),
      train: leg.type === 'train' ? leg.trips_per_day : (leg.train_trips || 0),
    }));

    // Is there ANY logistics data at all?
    const dataExists =
      carrierList.length > 0 ||
      busTrips > 0 ||
      trainTrips > 0 ||
      modes.length > 0 ||
      Object.keys(logistics).length > 0;

    return {
      carriers:       carrierList,
      totalBusTrips:  busTrips,
      totalTrainTrips:trainTrips,
      totalTrips:     busTrips + trainTrips,
      modesUsed:      modes,
      srcToDest:      src,
      dstToSrc:       dst,
      legs:           legList,
      hasData:        dataExists,
    };
  }, [routeData]);

  if (!hasData) {
    return (
      <div className="ls-card">
        <div className="ls-header">
          <div className="ls-header-left">
            <div className="ls-icon-badge"><Package size={20} /></div>
            <div>
              <h3 className="ls-title">Luggage &amp; Parcel Share</h3>
              <p className="ls-subtitle">{sourceName} &nbsp;<ArrowLeftRight size={13} />&nbsp; {destName}</p>
            </div>
          </div>
        </div>
        <div className="ls-loading" style={{ color: '#94a3b8' }}>
          <Package size={20} />
          <span>No logistics data available for this route.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ls-card">

      {/* ── Header ── */}
      <div className="ls-header">
        <div className="ls-header-left">
          <div className="ls-icon-badge"><Package size={20} /></div>
          <div>
            <h3 className="ls-title">Luggage &amp; Parcel Share</h3>
            <p className="ls-subtitle">
              {sourceName}&nbsp;<ArrowLeftRight size={13} className="ls-arrow-mid" />&nbsp;{destName}
            </p>
          </div>
        </div>
        {/*<div className="ls-live-badge">
          <span className="ls-live-dot" /> Live Data
        </div>*/}
      </div>

      <div className="ls-body">

        {/* ── KPI row ── */}
        <div className="ls-kpi-row">
          <div className="ls-kpi">
            <div className="ls-kpi-icon blue"><Bus size={16} /></div>
            <div>
              <div className="ls-kpi-value">{totalBusTrips}</div>
              <div className="ls-kpi-label">Bus Trips / Day</div>
            </div>
          </div>
          <div className="ls-kpi">
            <div className="ls-kpi-icon green"><Train size={16} /></div>
            <div>
              <div className="ls-kpi-value">{totalTrainTrips}</div>
              <div className="ls-kpi-label">Train Trips / Day</div>
            </div>
          </div>
          <div className="ls-kpi">
            <div className="ls-kpi-icon orange"><Truck size={16} /></div>
            <div>
              <div className="ls-kpi-value">{totalTrips}</div>
              <div className="ls-kpi-label">Total Services</div>
            </div>
          </div>
          <div className="ls-kpi">
            <div className="ls-kpi-icon purple"><Package size={16} /></div>
            <div>
              <div className="ls-kpi-value">{modesUsed.length || carriers.length}</div>
              <div className="ls-kpi-label">Active Modes</div>
            </div>
          </div>
        </div>

        {/* ── Direction flow bar ── */}
        {(srcToDest > 0 || dstToSrc > 0) && (
          <div className="ls-flow-section">
            <div className="ls-flow-labels">
              <span className="ls-flow-city">{sourceName}</span>
              <ArrowRight size={14} className="ls-flow-arr" />
              <span className="ls-flow-city">{destName}</span>
            </div>
            <div className="ls-flow-bar-wrap">
              <div className="ls-flow-fill src" style={{ width: `${srcToDest}%` }}>
                {srcToDest > 8 && <span>{srcToDest}%</span>}
              </div>
              <div className="ls-flow-fill dst" style={{ width: `${dstToSrc}%` }}>
                {dstToSrc > 8 && <span>{dstToSrc}%</span>}
              </div>
            </div>
            <div className="ls-flow-legend">
              <span><span className="ls-dot src-dot" />{sourceName} → {destName} (Bus + Train share)</span>
              <span><span className="ls-dot dst-dot" />{destName} → {sourceName} (Other modes)</span>
            </div>
          </div>
        )}

        {/* ── Split: Carrier breakdown + Route legs ── */}
        <div className="ls-split">

          {/* Left — Parcel movement by mode */}
          <div className="ls-carriers">
            <h4 className="ls-section-title"><BarChart2 size={14} /> Parcel Movement by Mode</h4>
            {carriers.length > 0 ? (
              <div className="ls-carrier-list">
                {carriers.map((c, i) => {
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
            ) : (
              <p className="ls-no-data">No parcel movement data.</p>
            )}
          </div>

          {/* Right — Route legs + Modes used */}
          <div className="ls-right-col">

            {/* Route legs (transport schedule)
            {legs.length > 0 && (
              <div className="ls-items-box">
                <h4 className="ls-section-title"><MapPin size={14} /> Route Legs</h4>
                <div className="ls-legs-list">
                  {legs.map((leg, i) => (
                    <div key={i} className="ls-leg-row">
                      <div className="ls-leg-route">
                        <span className="ls-leg-city">{leg.from}</span>
                        <ArrowRight size={12} className="ls-leg-arr" />
                        <span className="ls-leg-city">{leg.to}</span>
                      </div>
                      <div className="ls-leg-stats">
                        <span className="ls-leg-chip bus">
                          <Bus size={11} /> {leg.bus} bus
                        </span>
                        <span className="ls-leg-chip train">
                          <Train size={11} /> {leg.train} train
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}*/}

            {/* Modes used */}
            {modesUsed.length > 0 && (
              <div className="ls-peak-box">
                <h4 className="ls-section-title"><CheckCircle2 size={14} /> Logistics Modes Used</h4>
                <div className="ls-items-list">
                  {modesUsed.map((m, i) => {
                    const col = modeColor(m);
                    return (
                      <span
                        key={i}
                        className="ls-item-chip"
                        style={{ background: col.bg, color: col.text, border: `1px solid ${col.text}30` }}
                      >
                        <ModeIcon mode={m} size={11} /> &nbsp;{m}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Source → Dest direction label ── */}
        <div className="ls-route-footer">
          <div className="ls-route-pill">
            <MapPin size={13} className="ls-route-pin src" />
            <span>{sourceName}</span>
            <ArrowRight size={13} className="ls-route-arr" />
            <MapPin size={13} className="ls-route-pin dst" />
            <span>{destName}</span>
            <span className="ls-route-tag">Logistics Corridor</span>
          </div>
        </div>

      </div>
    </div>
  );
}
