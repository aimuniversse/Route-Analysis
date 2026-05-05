import React, { useState } from 'react';
import {
  Users, MapPin, Building2, Landmark, Mountain,
  Bus, Train, Car, Briefcase, Package, Navigation, Clock,
  CheckCircle2, ArrowRight, Plane, Activity, Calendar, Share2,
  TrendingUp, Sun, ChevronRight, Sparkles, MoreHorizontal, Info,
  GraduationCap, Factory, BarChart2, ShieldCheck, Timer, Globe, Headphones,
  Leaf, Compass, Fuel, Mail, Phone
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import './PremiumReportPage.css';
import pinIcon from '../assets/image/pin.png';
import industryIcon from '../assets/image/industry.png';
import touristIcon from '../assets/image/tourist.png';
import pointIcon from '../assets/image/point.png';
import destinationIcon from '../assets/image/destination.png';
// import logoImg from '../assets/image/logo.webp';
import logo1Img from '../assets/image/logo1.jpeg';

const heroImage = "file:///C:/Users/DELL/.gemini/antigravity/brain/f0fc39a6-0b6f-4034-8de5-2f0a1281ca0d/route_analysis_illustration_1777438205145.png";

// Data
const transportData = [
  { name: 'Bus', value: 65, color: '#3b82f6' },
  { name: 'Train', value: 25, color: '#10b981' },
  { name: 'Car', value: 7, color: '#f59e0b' },
  { name: 'Flight', value: 3, color: '#8b5cf6' },
];

const stateVisitorData = [
  { state: 'Tamil Nadu', visitors: 75, details: 'Chennai, Coimbatore, Tirupur' },
  { state: 'Karnataka', visitors: 12, details: 'Bangalore, Mysore, Mangalore' },
  { state: 'Kerala', visitors: 8, details: 'Kochi, Thiruvananthapuram' },
  { state: 'Others', visitors: 5, details: 'Various States' },
];

const distanceMatrix = [
  { city: 'Coimbatore', cbe: 0, trp: 45, erd: 100, slm: 160, vlr: 220, maa: 500 },
  { city: 'Tirupur', cbe: 45, trp: 0, erd: 55, slm: 115, vlr: 175, maa: 455 },
  { city: 'Erode', cbe: 100, trp: 55, erd: 0, slm: 60, vlr: 120, maa: 400 },
  { city: 'Salem', cbe: 160, trp: 115, erd: 60, slm: 0, vlr: 60, maa: 340 },
  { city: 'Vellore', cbe: 220, trp: 175, erd: 120, slm: 60, vlr: 0, maa: 280 },
  { city: 'Chennai', cbe: 500, trp: 455, erd: 400, slm: 340, vlr: 280, maa: 0 },
];

const suggestedRoutes = [
  {
    id: 1,
    name: 'Primary Industrial Route',
    time: '8 - 10 hours',
    distance: '500 km',
    via: 'Tirupur - Erode - Salem - Vellore',
    type: 'RECOMMENDED',
    efficiency: 'Most Efficient',
    efficiencyDesc: 'Best balance of time & distance',
    icon: <Navigation size={22} />,
    color: '#3b82f6'
  },
  {
    id: 2,
    name: 'Alternative Highway Route',
    time: '9 - 11 hours',
    distance: '520 km',
    via: 'Dharmapuri - Krishnagiri',
    type: 'ALTERNATIVE',
    efficiency: 'Scenic & Smooth',
    efficiencyDesc: 'Well-connected highway network',
    icon: <MapPin size={22} />,
    color: '#10b981'
  },
  {
    id: 3,
    name: 'Southern Bypass Route',
    time: '10 - 12 hours',
    distance: '560 km',
    via: 'Pollachi - Dindigul - Trichy - Villupuram',
    type: 'SCENIC BYPASS',
    efficiency: 'Less Congestion',
    efficiencyDesc: 'Ideal for long hauls & bulk transport',
    icon: <Mountain size={22} />,
    color: '#8b5cf6'
  }
];

const busFrequencies = [
  { from: 'CBE', to: 'Chennai', label: 'Major Metro Connection', count: '100 - 150', icon: <Landmark size={18} /> },
  { from: 'CBE', to: 'Tirupur', label: 'Industrial Corridor', count: '50 - 100', icon: <Activity size={18} /> },
  { from: 'CBE', to: 'Erode', label: 'Regional Link', count: '20 - 50', icon: <Mountain size={18} /> },
  { from: 'CBE', to: 'Salem', label: 'City Connection', count: '10 - 20', icon: <Building2 size={18} /> },
];

const trainFrequencies = [
  { from: 'CBE', to: 'Chennai', label: 'Major Metro Connection', count: '10 - 20', icon: <Landmark size={18} /> },
  { from: 'CBE', to: 'Tirupur', label: 'Industrial Corridor', count: '5 - 10', icon: <Activity size={18} /> },
  { from: 'CBE', to: 'Erode', label: 'Regional Link', count: '2 - 5', icon: <Mountain size={18} /> },
  { from: 'CBE', to: 'Salem', label: 'City Connection', count: '1 - 2', icon: <Building2 size={18} /> },
];


export default function PremiumReportPage({ routeData }) {
  const routeName = routeData?.route_summary?.path || "Coimbatore to Chennai";
  const [formData, setFormData] = useState({ name: '', busTravels: '', contactNo: '', message: '' });
  const [formStatus, setFormStatus] = useState(null); // null | 'success' | 'error'

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const key = id === 'contact-name' ? 'name'
      : id === 'contact-email' ? 'busTravels'
      : id === 'contact-subject' ? 'contactNo'
      : 'message';
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contactNo.trim() || !formData.message.trim()) {
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 4000);
      return;
    }
    setFormStatus('success');
    setFormData({ name: '', busTravels: '', contactNo: '', message: '' });
    setTimeout(() => setFormStatus(null), 5000);
  };

  return (
    <div className="report-page-container">
      {/* Brand logo moved to section header for alignment */}
      <div className="report-content-wrapper">

        {/* Header */}
        <header className="report-header">
          <div className="header-badge">Corridor Report</div>
          <h1>{routeName}</h1>
          <p className="subtitle">Comprehensive Route Analysis & Travel Intelligence</p>
        </header>

        {/* Hero Image */}
        {/* <section className="hero-section">
          <div className="image-container">
            <img src={heroImage} alt="Route Analysis Illustration" className="hero-illustration" />
          </div>
        </section> */}

        {/* Concept 1 & 2: Population & Potential */}
        <div className="grid-2-col section-spacing">
          <section className="analysis-section-box population-overview-container">
            <div className="visitor-header-flex">
              <div className="visitor-title-box">
                <div className="icon-wrap bg-blue-soft"><Users className="text-blue-main" /></div>
                <div className="title-text-group">
                  <div className="title-with-logo">
                    <h2>Population Overview</h2>
                    <img src={logo1Img} alt="Company Logo" className="inline-brand-logo" />
                  </div>
                  <p className="subtitle-small">Population range by major cities</p>
                </div>
              </div>
              <div className="population-group-visual">
                <div className="skyline-bg"></div>
                <div className="user-group">
                  <Users className="user-icon user-1" size={32} />
                  <Users className="user-icon user-2" size={44} />
                  <Users className="user-icon user-3" size={32} />
                </div>
              </div>
            </div>

            <div className="population-list">
              <div className="population-item">
                <div className="city-info-left">
                  <div className="city-icon-badge bg-blue-light">
                    <Landmark size={20} className="text-blue-main" />
                  </div>
                  <span className="dot bg-blue-main"></span>
                  <span className="city-name">Coimbatore</span>
                </div>
                <div className="pop-badge bg-blue-light text-blue-main">1.6M - 2.0M</div>
              </div>

              <div className="population-item">
                <div className="city-info-left">
                  <div className="city-icon-badge bg-purple-light">
                    <Building2 size={20} className="text-purple-main" />
                  </div>
                  <span className="dot bg-purple-main"></span>
                  <span className="city-name">Tirupur</span>
                </div>
                <div className="pop-badge bg-purple-light text-purple-main">0.8M - 1.2M</div>
              </div>

              <div className="population-item">
                <div className="city-info-left">
                  <div className="city-icon-badge bg-orange-light">
                    <Activity size={20} className="text-orange-main" />
                  </div>
                  <span className="dot bg-orange-main"></span>
                  <span className="city-name">Erode</span>
                </div>
                <div className="pop-badge bg-orange-light text-orange-main">0.5M - 0.8M</div>
              </div>

              <div className="population-item">
                <div className="city-info-left">
                  <div className="city-icon-badge bg-green-light">
                    <Landmark size={20} className="text-green-main" />
                  </div>
                  <span className="dot bg-green-main"></span>
                  <span className="city-name">Salem</span>
                </div>
                <div className="pop-badge bg-green-light text-green-main">0.8M - 1.2M</div>
              </div>

              <div className="population-item">
                <div className="city-info-left">
                  <div className="city-icon-badge bg-pink-light">
                    <Building2 size={20} className="text-pink-main" />
                  </div>
                  <span className="dot bg-pink-main"></span>
                  <span className="city-name">Vellore</span>
                </div>
                <div className="pop-badge bg-pink-light text-pink-main">0.5M - 0.8M</div>
              </div>

              <div className="population-item">
                <div className="city-info-left">
                  <div className="city-icon-badge bg-indigo-light">
                    <Landmark size={20} className="text-indigo-main" />
                  </div>
                  <span className="dot bg-indigo-main"></span>
                  <span className="city-name">Chennai</span>
                </div>
                <div className="pop-badge bg-indigo-light text-indigo-main">7.0M - 9.0M</div>
              </div>
            </div>

            <div className="total-population-footer">
              <div className="total-left">
                <div className="total-icon-wrap">
                  <Users size={24} />
                </div>
                <span className="total-label">Total Corridor Population</span>
              </div>
              <div className="total-right">
                <div className="vertical-dotted-sep"></div>
                <span className="total-value">11.2M - 15.8M</span>
              </div>
            </div>
          </section>

          <section className="analysis-section-box area-potential-container">
            <div className="visitor-header-flex">
              <div className="visitor-title-box">
                <div className="icon-wrap bg-orange-soft"><Briefcase className="text-orange-main" /></div>
                <div>
                  <h2 className="title-split">Potential <span className="text-pink-main">of the Area</span></h2>
                  <p className="subtitle-small">The Coimbatore to Chennai corridor has a diverse range of attractions and industries, including:</p>
                </div>
              </div>
              <div className="growth-visual-top">
                <div className="growth-chart-mini">
                  <div className="growth-bars">
                    <div className="gbar" style={{ height: '40%' }}></div>
                    <div className="gbar" style={{ height: '60%' }}></div>
                    <div className="gbar" style={{ height: '50%' }}></div>
                    <div className="gbar" style={{ height: '80%' }}></div>
                    <div className="gbar" style={{ height: '70%' }}></div>
                  </div>
                  <svg className="growth-trend" viewBox="0 0 100 40">
                    <path d="M0,35 Q25,30 50,15 T100,5" fill="none" stroke="#ff4d6d" strokeWidth="2" />
                    <ArrowRight className="trend-arrow" size={12} />
                  </svg>
                  <div className="skyline-silhouette"></div>
                </div>
              </div>
            </div>

            <div className="potential-cards-list">
              <div className="potential-card-item">
                <div className="card-icon-side">
                  <div className="p-icon-badge bg-orange-soft">
                    <GraduationCap className="text-orange-main" size={28} />
                  </div>
                  <div className="v-sep bg-orange-main"></div>
                </div>
                <div className="card-text-side">
                  <h3>Education & Institutions</h3>
                  <p>Coimbatore is home to several prestigious educational institutions, including the Coimbatore Institute of Technology and the PSG College of Technology.</p>
                </div>
                <div className="card-number-badge bg-orange-soft text-orange-main">01</div>
              </div>

              <div className="potential-card-item">
                <div className="card-icon-side">
                  <div className="p-icon-badge bg-purple-soft">
                    <Landmark className="text-purple-main" size={28} />
                  </div>
                  <div className="v-sep bg-purple-main"></div>
                </div>
                <div className="card-text-side">
                  <h3>Temples & Heritage</h3>
                  <p>The corridor is home to several famous temples, including the Perur Pateeswarar Temple in Coimbatore and the Kapaleeswarar Temple in Chennai.</p>
                </div>
                <div className="card-number-badge bg-purple-soft text-purple-main">02</div>
              </div>

              <div className="potential-card-item">
                <div className="card-icon-side">
                  <div className="p-icon-badge bg-green-soft">
                    <Mountain className="text-green-main" size={28} />
                  </div>
                  <div className="v-sep bg-green-main"></div>
                </div>
                <div className="card-text-side">
                  <h3>Tourist Attractions</h3>
                  <p>The corridor is home to several popular tourist attractions, including the Nilgiri Hills, the Kodaikanal Lake, and the Marina Beach in Chennai.</p>
                </div>
                <div className="card-number-badge bg-green-soft text-green-main">03</div>
              </div>

              <div className="potential-card-item">
                <div className="card-icon-side">
                  <div className="p-icon-badge bg-blue-soft">
                    <Factory className="text-blue-main" size={28} />
                  </div>
                  <div className="v-sep bg-blue-main"></div>
                </div>
                <div className="card-text-side">
                  <h3>Companies & Industries</h3>
                  <p>The corridor is home to several major industries, including textiles, automotive, and IT. Some of the major companies include Tata Motors, Ford India, and Hyundai India.</p>
                </div>
                <div className="card-number-badge bg-blue-soft text-blue-main">04</div>
              </div>
            </div>
          </section>
        </div>

        {/* Concept 3: Area Segmentation */}
        <section className="analysis-section-box section-spacing">
          <div className="box-header">
            <div className="icon-wrap bg-green"><MapPin /></div>
            <h2>Area Segmentation</h2>
          </div>
          <div className="segmentation-model-container">
            <div className="timeline-horizontal-line"></div>
            <div className="timeline-nodes-wrapper">
              
              {/* Node 1: Origin */}
              <div className="model-timeline-node is-top">
                <div className="node-content-box">
                  <div className="node-image-circle">
                    <img src={pinIcon} alt="Origin" />
                  </div>
                  <div className="node-title-main">Origin</div>
                </div>
                <div className="node-marker-dot"></div>
                <div className="node-vertical-connector"></div>
                <div className="node-desc-text">Coimbatore: The starting point of the corridor.</div>
              </div>

              {/* Node 2: Industrial Zone */}
              <div className="model-timeline-node is-bottom">
                <div className="node-content-box">
                  <div className="node-image-circle">
                    <img src={industryIcon} alt="Industrial Zone" />
                  </div>
                  <div className="node-title-main">Industrial Zone</div>
                </div>
                <div className="node-marker-dot"></div>
                <div className="node-vertical-connector"></div>
                <div className="node-desc-text">Tirupur, Erode, Salem: Major textile and steel manufacturing hubs.</div>
              </div>

              {/* Node 3: Tourist Zone */}
              <div className="model-timeline-node is-top">
                <div className="node-content-box">
                  <div className="node-image-circle">
                    <img src={touristIcon} alt="Tourist Zone" />
                  </div>
                  <div className="node-title-main">Tourist Zone</div>
                </div>
                <div className="node-marker-dot"></div>
                <div className="node-vertical-connector"></div>
                <div className="node-desc-text">Nilgiri Hills, Kodaikanal: Scenic beauty and popular hill stations.</div>
              </div>

              {/* Node 4: Entry Zone */}
              <div className="model-timeline-node is-bottom">
                <div className="node-content-box">
                  <div className="node-image-circle">
                    <img src={pointIcon} alt="Entry Zone" />
                  </div>
                  <div className="node-title-main">Entry Zone</div>
                </div>
                <div className="node-marker-dot"></div>
                <div className="node-vertical-connector"></div>
                <div className="node-desc-text">Vellore: Historical city known for its fort and gold temple.</div>
              </div>

              {/* Node 5: Destination */}
              <div className="model-timeline-node is-top">
                <div className="node-content-box">
                  <div className="node-image-circle">
                    <img src={destinationIcon} alt="Destination" />
                  </div>
                  <div className="node-title-main">Destination</div>
                </div>
                <div className="node-marker-dot"></div>
                <div className="node-vertical-connector"></div>
                <div className="node-desc-text">Chennai: Major metro city, beach destination, and IT hub.</div>
              </div>

            </div>
          </div>
        </section>

        {/* Concept 4: Total Visitor Count - Redesigned */}
        <section className="analysis-section-box section-spacing visitor-stats-container">
          <div className="visitor-header-flex">
            <div className="visitor-title-box">
              <div className="icon-wrap bg-pink-light"><Calendar className="text-pink" /></div>
              <div>
                <h2>Total Visitor Count</h2>
                <p className="subtitle-small">Overview of yearly and daily visitors</p>
              </div>
            </div>
            <div className="visitor-graph-visual">
              {/* Simplified 3D graph representation using CSS/SVG */}
              <div className="mini-bars">
                <div className="bar" style={{ height: '30%' }}></div>
                <div className="bar" style={{ height: '50%' }}></div>
                <div className="bar" style={{ height: '40%' }}></div>
                <div className="bar" style={{ height: '70%' }}></div>
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar" style={{ height: '90%' }}></div>
              </div>
              <svg className="graph-line" viewBox="0 0 100 50">
                <path d="M0,40 L20,30 L40,45 L60,10 L80,25 L100,5" fill="none" stroke="#ff4d6d" strokeWidth="3" />
                <circle cx="100" cy="5" r="4" fill="#ff4d6d" />
              </svg>
              <div className="user-overlay-icon">
                <Users size={16} />
              </div>
            </div>
          </div>

          <div className="stats-grid-modern">
            <div className="stat-card-modern">
              <div className="stat-card-header">
                <div className="mini-icon bg-pink-soft"><TrendingUp size={16} className="text-pink" /></div>
                <span>Yearly Total</span>
              </div>
              <div className="stat-value">10M - 15M</div>
              <div className="stat-underline"></div>
            </div>
            
            <div className="stat-card-modern">
              <div className="stat-card-header">
                <div className="mini-icon bg-pink-soft"><Clock size={16} className="text-pink" /></div>
                <span>Daily (Normal)</span>
              </div>
              <div className="stat-value">20K - 30K</div>
              <div className="stat-underline"></div>
            </div>

            <div className="stat-card-modern highlighted">
              <div className="stat-card-header">
                <div className="mini-icon bg-pink-soft"><TrendingUp size={16} className="text-pink" /></div>
                <span>Daily (Peak)</span>
              </div>
              <div className="stat-value">50K - 70K</div>
              <div className="stat-underline"></div>
            </div>
          </div>

          <div className="attractions-list-container">
            <div className="attractions-header">
              <div className="title-row">
                <MapPin className="text-pink" size={20} />
                <h3>Key Attractions (Yearly / Daily)</h3>
                <div className="header-line"></div>
                <Sparkles className="text-pink" size={16} />
              </div>
            </div>

            <div className="attraction-items">
              <div className="attraction-item-row">
                <div className="attraction-main">
                  <div className="attraction-img-circle">
                    <Mountain size={24} className="text-pink" />
                  </div>
                  <span className="attraction-name">Nilgiri Hills</span>
                </div>
                <div className="attraction-stats-box">
                  <div className="stat-sub">
                    <Users size={14} className="text-pink" />
                    <span>1M - 2M</span>
                  </div>
                  <div className="stat-sep"></div>
                  <div className="stat-sub">
                    <Sun size={14} className="text-pink" />
                    <span>2K - 5K</span>
                  </div>
                </div>
                <ChevronRight className="text-slate-light" size={20} />
              </div>

              <div className="attraction-item-row">
                <div className="attraction-main">
                  <div className="attraction-img-circle">
                    <Activity size={24} className="text-pink" />
                  </div>
                  <span className="attraction-name">Kodaikanal Lake</span>
                </div>
                <div className="attraction-stats-box">
                  <div className="stat-sub">
                    <Users size={14} className="text-pink" />
                    <span>0.5M - 1M</span>
                  </div>
                  <div className="stat-sep"></div>
                  <div className="stat-sub">
                    <Sun size={14} className="text-pink" />
                    <span>1K - 3K</span>
                  </div>
                </div>
                <ChevronRight className="text-slate-light" size={20} />
              </div>

              <div className="attraction-item-row">
                <div className="attraction-main">
                  <div className="attraction-img-circle">
                    <Plane size={24} className="text-pink" />
                  </div>
                  <span className="attraction-name">Marina Beach</span>
                </div>
                <div className="attraction-stats-box">
                  <div className="stat-sub">
                    <Users size={14} className="text-pink" />
                    <span>2M - 3M</span>
                  </div>
                  <div className="stat-sep"></div>
                  <div className="stat-sub">
                    <Sun size={14} className="text-pink" />
                    <span>5K - 10K</span>
                  </div>
                </div>
                <ChevronRight className="text-slate-light" size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* Concept 5: Top Visitors by State - Redesigned */}
        <section className="analysis-section-box section-spacing state-visitors-container">
          <div className="visitor-header-flex">
            <div className="visitor-title-box">
              <div className="icon-wrap bg-pink-light"><Share2 className="text-pink" /></div>
              <div>
                <h2>Top Visitors by State</h2>
                <p className="subtitle-small">Distribution of visitors across different states</p>
              </div>
            </div>
            <div className="map-visual-top">
              {/* Simplified India Map representation */}
              <div className="mini-map-container">
                <MapPin className="pin pin-1" size={14} />
                <MapPin className="pin pin-2" size={14} />
                <MapPin className="pin pin-3" size={14} />
                <div className="user-icons-group">
                  <Users size={12} />
                  <Users size={12} />
                </div>
              </div>
            </div>
          </div>

          <div className="custom-bar-chart">
            <div className="chart-row">
              <div className="state-info">
                <div className="state-icon-circle bg-pink-soft">
                  <Landmark className="text-pink" size={22} />
                </div>
                <div className="state-name-box">
                  <span className="state-name">Tamil Nadu</span>
                  <span className="state-pct">70% - 80%</span>
                </div>
              </div>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: '75%' }}></div>
                <span className="bar-label">70% - 80%</span>
              </div>
            </div>

            <div className="chart-row">
              <div className="state-info">
                <div className="state-icon-circle bg-pink-soft">
                  <Building2 className="text-pink" size={22} />
                </div>
                <div className="state-name-box">
                  <span className="state-name">Karnataka</span>
                  <span className="state-pct">10% - 15%</span>
                </div>
              </div>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: '15%' }}></div>
                <span className="bar-label">10% - 15%</span>
              </div>
            </div>

            <div className="chart-row">
              <div className="state-info">
                <div className="state-icon-circle bg-pink-soft">
                  <Activity className="text-pink" size={22} />
                </div>
                <div className="state-name-box">
                  <span className="state-name">Kerala</span>
                  <span className="state-pct">5% - 10%</span>
                </div>
              </div>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: '10%' }}></div>
                <span className="bar-label">5% - 10%</span>
              </div>
            </div>

            <div className="chart-row">
              <div className="state-info">
                <div className="state-icon-circle bg-pink-soft">
                  <MoreHorizontal className="text-pink" size={22} />
                </div>
                <div className="state-name-box">
                  <span className="state-name">Others</span>
                  <span className="state-pct">2% - 5%</span>
                </div>
              </div>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: '5%' }}></div>
                <span className="bar-label">2% - 5%</span>
              </div>
            </div>

            <div className="chart-axis">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
              <div className="axis-lines">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>

          <div className="info-footer-banner">
            <Info size={16} className="text-pink" />
            <span>* Tamil Nadu (70-80%), Karnataka (10-15%), Kerala (5-10%), Others (2-5%)</span>
          </div>
        </section>

        {/* Concept 6: Distance Matrix - Redesigned */}
        <section className="analysis-section-box section-spacing distance-matrix-container">
          <div className="visitor-header-flex">
            <div className="visitor-title-box">
              <div className="icon-wrap bg-orange-light"><Navigation className="text-orange-main" /></div>
              <div>
                <h2>Distance Matrix (km)</h2>
                <p className="subtitle-small">Distance between major cities in Tamil Nadu</p>
              </div>
            </div>
            <div className="route-visual-top">
              <div className="dotted-route-container">
                <MapPin className="pin pin-start" size={18} />
                <svg className="curvy-path-svg" viewBox="0 0 100 40">
                  <path 
                    d="M 5,30 Q 25,5 50,20 T 95,10" 
                    fill="none" 
                    stroke="#ff9800" 
                    strokeWidth="2.5" 
                    strokeDasharray="4 6" 
                    strokeLinecap="round"
                  />
                </svg>
                <MapPin className="pin pin-end" size={24} />
              </div>
            </div>
          </div>

          <div className="table-responsive-modern">
            <table className="distance-table">
              <thead>
                <tr>
                  <th className="corner-cell">
                    <div className="city-header-item">
                      <Landmark size={18} className="text-orange-main" />
                      <span>City</span>
                    </div>
                  </th>
                  <th><div className="city-header-icon"><Landmark size={20} /><br/>CBE</div></th>
                  <th><div className="city-header-icon"><Activity size={20} /><br/>TRP</div></th>
                  <th><div className="city-header-icon"><Building2 size={20} /><br/>ERD</div></th>
                  <th><div className="city-header-icon"><Landmark size={20} /><br/>SLM</div></th>
                  <th><div className="city-header-icon"><Landmark size={20} /><br/>VLR</div></th>
                  <th><div className="city-header-icon"><Building2 size={20} /><br/>MAA</div></th>
                </tr>
              </thead>
              <tbody>
                <tr className="dist-row">
                  <td className="row-label"><div className="city-label"><Landmark size={18} /> Coimbatore</div></td>
                  <td className="zero-cell">0</td><td>45</td><td>100</td><td>160</td><td>220</td><td>500</td>
                </tr>
                <tr className="dist-row">
                  <td className="row-label"><div className="city-label"><Activity size={18} /> Tirupur</div></td>
                  <td>45</td><td className="zero-cell">0</td><td>55</td><td>115</td><td>175</td><td>455</td>
                </tr>
                <tr className="dist-row">
                  <td className="row-label"><div className="city-label"><Building2 size={18} /> Erode</div></td>
                  <td>100</td><td>55</td><td className="zero-cell">0</td><td>60</td><td>120</td><td>400</td>
                </tr>
                <tr className="dist-row">
                  <td className="row-label"><div className="city-label"><Landmark size={18} /> Salem</div></td>
                  <td>160</td><td>115</td><td>60</td><td className="zero-cell">0</td><td>60</td><td>340</td>
                </tr>
                <tr className="dist-row">
                  <td className="row-label"><div className="city-label"><Landmark size={18} /> Vellore</div></td>
                  <td>220</td><td>175</td><td>120</td><td>60</td><td className="zero-cell">0</td><td>280</td>
                </tr>
                <tr className="dist-row">
                  <td className="row-label"><div className="city-label"><Building2 size={18} /> Chennai</div></td>
                  <td>500</td><td>455</td><td>400</td><td>340</td><td>280</td><td className="zero-cell">0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="info-footer-banner orange">
            <Info size={16} className="text-orange-main" />
            <span>All distances are approximate road distances in kilometers.</span>
          </div>
        </section>

        {/* Concept 7: Mode of Transport - Redesigned */}
        <section className="analysis-section-box section-spacing transport-modern-container">
          <div className="visitor-header-flex">
            <div className="visitor-title-box">
              <div className="icon-wrap bg-green-soft"><Bus className="text-green-main" /></div>
              <div>
                <h2>Mode of Transport</h2>
                <p className="subtitle-small">Overall preferred modes of transport used for logistics and travel.</p>
              </div>
            </div>
          </div>

          <div className="transport-content-grid">
            <div className="donut-chart-side">
              <div className="donut-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={transportData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={80} 
                      outerRadius={110} 
                      paddingAngle={5} 
                      dataKey="value"
                      stroke="none"
                    >
                      {transportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center-text">
                  <span className="percent">100%</span>
                  <span className="label">Total</span>
                </div>
              </div>
            </div>

            <div className="progress-legend-side">
              <div className="legend-item-modern">
                <div className="legend-header">
                  <div className="legend-icon bg-blue-soft"><Bus className="text-blue-main" size={18} /></div>
                  <span className="legend-name">Bus</span>
                  <span className="legend-pct">60-70%</span>
                </div>
                <div className="legend-progress-bar">
                  <div className="progress-fill bg-blue-main" style={{ width: '65%' }}></div>
                </div>
                <p className="legend-desc">Most preferred for short & long distance travel.</p>
              </div>

              <div className="legend-item-modern">
                <div className="legend-header">
                  <div className="legend-icon bg-green-soft"><Train className="text-green-main" size={18} /></div>
                  <span className="legend-name">Train</span>
                  <span className="legend-pct">20-30%</span>
                </div>
                <div className="legend-progress-bar">
                  <div className="progress-fill bg-green-main" style={{ width: '25%' }}></div>
                </div>
                <p className="legend-desc">Reliable for medium to long distance routes.</p>
              </div>

              <div className="legend-item-modern">
                <div className="legend-header">
                  <div className="legend-icon bg-orange-soft"><Car className="text-orange-main" size={18} /></div>
                  <span className="legend-name">Car</span>
                  <span className="legend-pct">5-10%</span>
                </div>
                <div className="legend-progress-bar">
                  <div className="progress-fill bg-orange-main" style={{ width: '8%' }}></div>
                </div>
                <p className="legend-desc">Preferred for personal & short distance travel.</p>
              </div>

              <div className="legend-item-modern">
                <div className="legend-header">
                  <div className="legend-icon bg-purple-soft"><Plane className="text-purple-main" size={18} /></div>
                  <span className="legend-name">Flight</span>
                  <span className="legend-pct">2-5%</span>
                </div>
                <div className="legend-progress-bar">
                  <div className="progress-fill bg-purple-main" style={{ width: '4%' }}></div>
                </div>
                <p className="legend-desc">Used for long distance & urgent deliveries.</p>
              </div>
            </div>
          </div>

          <div className="insight-footer-box">
            <div className="insight-icon bg-blue-soft">
              <BarChart2 className="text-blue-main" size={20} />
            </div>
            <div className="insight-text">
              <strong>Insight</strong>
              <p>Bus transport dominates logistics movement, followed by rail for efficient long-distance connectivity.</p>
            </div>
          </div>
        </section>

        {/* Concept 8: Luggage & Parcel Services - Redesigned */}
        <section className="analysis-section-box section-spacing luggage-modern-container">
          <div className="visitor-header-flex">
            <div className="visitor-title-box">
              <div className="icon-wrap bg-orange-soft"><Package className="text-orange-main" /></div>
              <div>
                <h2>Luggage & Parcel Services</h2>
                <p className="subtitle-small">Comprehensive and reliable solutions for all your travel and delivery needs.</p>
              </div>
            </div>
          </div>

          <div className="services-rows-list">
            {/* Bus Parcels */}
            <div className="service-split-row">
              <div className="service-main-info">
                <div className="service-icon-wrap bg-blue-soft"><Bus className="text-blue-main" size={24} /></div>
                <div className="service-text-wrap">
                  <div className="service-title-line">
                    <h3>Bus Parcels</h3>
                    <span className="status-badge bg-blue-soft text-blue-main"><CheckCircle2 size={12} /> WIDE COVERAGE</span>
                  </div>
                  <p>Available on most private & state buses across major routes.</p>
                </div>
              </div>
              <div className="service-detail-box bg-blue-light">
                <div className="detail-icon bg-white text-blue-main"><ShieldCheck size={20} /></div>
                <div className="detail-text">
                  <strong>High Availability</strong>
                  <p>Extensive network across cities & towns</p>
                </div>
                <ChevronRight className="detail-arrow text-blue-main" size={20} />
              </div>
            </div>

            {/* Train Parcels */}
            <div className="service-split-row">
              <div className="service-main-info">
                <div className="service-icon-wrap bg-green-soft"><Train className="text-green-main" size={24} /></div>
                <div className="service-text-wrap">
                  <div className="service-title-line">
                    <h3>Train Parcels</h3>
                    <span className="status-badge bg-green-soft text-green-main"><CheckCircle2 size={12} /> EXTENSIVE NETWORK</span>
                  </div>
                  <p>Extensive railway cargo network covering major stations & destinations.</p>
                </div>
              </div>
              <div className="service-detail-box bg-green-light">
                <div className="detail-icon bg-white text-green-main"><ShieldCheck size={20} /></div>
                <div className="detail-text">
                  <strong>Reliable & Secure</strong>
                  <p>Safe handling with timely deliveries</p>
                </div>
                <ChevronRight className="detail-arrow text-green-main" size={20} />
              </div>
            </div>

            {/* Couriers */}
            <div className="service-split-row">
              <div className="service-main-info">
                <div className="service-icon-wrap bg-orange-soft"><Briefcase className="text-orange-main" size={24} /></div>
                <div className="service-text-wrap">
                  <div className="service-title-line">
                    <h3>Couriers</h3>
                    <span className="status-badge bg-orange-soft text-orange-main"><CheckCircle2 size={12} /> TRUSTED PARTNERS</span>
                  </div>
                  <p>Partnered with leading courier services for fast & dependable delivery.</p>
                </div>
              </div>
              <div className="service-detail-box bg-orange-light">
                <div className="detail-icon bg-white text-orange-main"><ShieldCheck size={20} /></div>
                <div className="detail-text">
                  <strong>Top Partners</strong>
                  <p>DTDC, Blue Dart, FedEx & more</p>
                </div>
                <ChevronRight className="detail-arrow text-orange-main" size={20} />
              </div>
            </div>

            {/* Taxi Delivery */}
            <div className="service-split-row">
              <div className="service-main-info">
                <div className="service-icon-wrap bg-purple-soft"><Car className="text-purple-main" size={24} /></div>
                <div className="service-text-wrap">
                  <div className="service-title-line">
                    <h3>Taxi Delivery</h3>
                    <span className="status-badge bg-purple-soft text-purple-main"><CheckCircle2 size={12} /> DOOR-TO-DOOR</span>
                  </div>
                  <p>Door-to-door express delivery for urgent and time-sensitive parcels.</p>
                </div>
              </div>
              <div className="service-detail-box bg-purple-light">
                <div className="detail-icon bg-white text-purple-main"><ShieldCheck size={20} /></div>
                <div className="detail-text">
                  <strong>Fast & Convenient</strong>
                  <p>Real-time tracking with quick updates</p>
                </div>
                <ChevronRight className="detail-arrow text-purple-main" size={20} />
              </div>
            </div>
          </div>

          <div className="logistics-stats-footer">
            <div className="footer-promo">
              <div className="promo-icon-wrap bg-blue-main text-white"><ShieldCheck size={24} /></div>
              <div className="promo-text">
                <strong>Secure. Reliable. Everywhere.</strong>
                <p>Your parcels are in safe hands with our premium logistics network.</p>
              </div>
            </div>
            <div className="footer-metrics-grid">
              <div className="metric-item">
                <ShieldCheck className="text-blue-main" size={18} />
                <span>Secure Handling</span>
              </div>
              <div className="metric-item">
                <Timer className="text-green-main" size={18} />
                <span>On-Time Delivery</span>
              </div>
              <div className="metric-item">
                <Globe className="text-orange-main" size={18} />
                <span>Wide Reach</span>
              </div>
              <div className="metric-item">
                <Headphones className="text-purple-main" size={18} />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Concept 9: Specific Bus & Train Details */}
        <section className="analysis-section-box section-spacing transport-frequencies-container">
          <div className="section-main-header">
            <div className="title-area">
              <div className="header-icon-box">
                <Clock className="header-icon" fill="#ffcc00" size={24} />
              </div>
              <div className="header-text">
                <h2>Specific Bus and Train Frequencies</h2>
                <p>Daily Service Overview</p>
              </div>
            </div>
          </div>

          <div className="frequencies-content-grid">
            {/* Bus Services Card */}
            <div className="service-freq-card bus-theme">
              <div className="freq-card-header">
                <div className="header-left">
                  <div className="service-icon-box"><Bus size={24} /></div>
                  <h3>Bus Services (Daily)</h3>
                </div>
                <div className="header-badge-outline"><Activity size={12} /> High Coverage</div>
              </div>
              
              <div className="freq-list">
                {busFrequencies.map((item, idx) => (
                  <div key={idx} className="freq-item">
                    <div className="item-left">
                      <div className="item-icon-circle">{item.icon}</div>
                      <div className="item-info">
                        <strong>{item.from} to {item.to}</strong>
                        <span>{item.label}</span>
                      </div>
                    </div>
                    <div className="item-right">
                      <span className="count-text">{item.count}</span>
                      <span className="sub-count">Services / Day</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="freq-card-footer">
                <div className="footer-info-box">
                  <ShieldCheck size={18} />
                  <div className="info-text">
                    <strong>Extensive bus network ensuring seamless connectivity</strong>
                    <p>High frequency • Multiple operators • Reliable service</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Train Services Card */}
            <div className="service-freq-card train-theme">
              <div className="freq-card-header">
                <div className="header-left">
                  <div className="service-icon-box"><Train size={24} /></div>
                  <h3>Train Services (Daily)</h3>
                </div>
                <div className="header-badge-outline"><Sparkles size={12} /> Regional Connect</div>
              </div>

              <div className="freq-list">
                {trainFrequencies.map((item, idx) => (
                  <div key={idx} className="freq-item">
                    <div className="item-left">
                      <div className="item-icon-circle">{item.icon}</div>
                      <div className="item-info">
                        <strong>{item.from} to {item.to}</strong>
                        <span>{item.label}</span>
                      </div>
                    </div>
                    <div className="item-right">
                      <span className="count-text">{item.count}</span>
                      <span className="sub-count">Services / Day</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="freq-card-footer">
                <div className="footer-info-box">
                  <CheckCircle2 size={18} />
                  <div className="info-text">
                    <strong>Comfortable train travel with reliable schedules</strong>
                    <p>Reserved seating • Punctual service • Safe & comfortable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="frequencies-section-footer">
            <p><Sparkles size={14} className="text-gold" /> Note: Frequencies are approximate and may vary based on demand and operational schedules.</p>
          </div>
        </section>

        {/* Concept 10: Suggested Routes */}
       
      </div>

      {/* Contact Form Section */}
      <section className="contact-section">
        <div className="contact-inner">
          <div className="contact-heading">
            <h2 className="contact-title">Say Hello, Get in touch</h2>
            <p className="contact-subtitle">For bookings, route details, or service enquiries, please complete the form below. Our team will respond promptly to ensure a seamless and reliable travel experience.</p>
          </div>

          {formStatus === 'success' && (
            <div className="contact-response success-response">
              <div className="response-icon-wrap">
                <CheckCircle2 size={40} className="response-icon" />
              </div>
              <h3>Message Sent Successfully! 🎉</h3>
              <p>Thank you for reaching out. Our team will get back to you within <strong>24 hours</strong>.</p>
              <div className="response-meta">
                <span><Clock size={14} /> Response within 24 hrs</span>
                <span><Headphones size={14} /> 24/7 Support Available</span>
                <span><Mail size={14} /> info@tockmybus.com</span>
              </div>
            </div>
          )}

          {formStatus === 'error' && (
            <div className="contact-response error-response">
              <div className="response-icon-wrap">
                <Info size={36} className="response-icon" />
              </div>
              <h3>Please fill in required fields</h3>
              <p>Name, Contact No, and Message are required to send your enquiry.</p>
            </div>
          )}

          <form className="contact-form" onSubmit={handleFormSubmit}>
            <div className="contact-row-three">
              <div className="contact-field">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email">Bus Travels Name</label>
                <input
                  id="contact-email"
                  type="text"
                  placeholder="Bus travels name"
                  value={formData.busTravels}
                  onChange={handleInputChange}
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-subject">Contact No</label>
                <input
                  id="contact-subject"
                  type="tel"
                  placeholder="Contact No"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="contact-field contact-message-field">
              <label htmlFor="contact-message">Your message</label>
              <textarea
                id="contact-message"
                rows={6}
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="contact-submit-wrap">
              <button type="submit" className="contact-submit-btn">
                <Mail size={16} /> Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand-section">
              <img src={logo1Img} alt="TickMyBus Logo" className="footer-logo" />
              <p className="brand-desc">TICK MY BUS is the best way to Transport bus tickets online on the website or from your mobile in a few easy steps Go to My Bookings to manage your account..</p>
              <div className="social-links">
                <a href="#"><Globe size={20} /></a>
                <a href="#"><Share2 size={20} /></a>
                <a href="#"><Activity size={20} /></a>
                <a href="#"><Navigation size={20} /></a>
              </div>
            </div>

            <div className="footer-links-grid">
              <div className="footer-column">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="#">FAQ</a></li>
                  <li><a href="#">Terms & Conditions</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Feedback</a></li>
                  <li><a href="#">Contact Us</a></li>
                  <li><a href="#">Boarding Places</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Manage Ticket</h4>
                <ul>
                  <li><a href="#">Download Ticket</a></li>
                  <li><a href="#">Track Your Bus</a></li>
                  <li><a href="#">Cancel Ticket</a></li>
                  <li><a href="#">Change Boarding Point</a></li>
                  <li><a href="#">Change Travel Date</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Contact Info</h4>
                <div className="contact-info-list">
                  <div className="contact-item">
                    <MapPin size={20} className="contact-icon" />
                    <span>Coimbatore, Tamil Nadu 641006, IN</span>
                  </div>
                  <div className="contact-item">
                    <Phone size={20} className="contact-icon" />
                    <span>9092748488</span>
                  </div>
                  <div className="contact-item">
                    <Mail size={20} className="contact-icon" />
                    <span>info@tockmybus.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} TickMyBus. All Rights Reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Powered By AIM UNIVERSSE DEVELOPERS</a>
              {/* <a href="#">Sitemap</a> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}