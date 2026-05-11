import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  BarChart2, 
  Activity, 
  Bookmark, 
  Bell, 
  FileText, 
  Settings,
  MapPin
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'routes', icon: <Map size={20} />, label: 'Routes' },
    { id: 'analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
    { id: 'traffic', icon: <Activity size={20} />, label: 'Traffic' },
    { id: 'saved', icon: <Bookmark size={20} />, label: 'Saved Trips' },
    { id: 'alerts', icon: <Bell size={20} />, label: 'Alerts' },
    { id: 'premium', icon: <FileText size={20} />, label: 'Reports' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon-container">
          <MapPin size={24} color="#fff" fill="var(--accent-blue)" />
        </div>
        <div>
          <h1 className="logo-text">Route</h1>
          <h1 className="logo-text">Analysis AI</h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div 
            key={item.id} 
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="upgrade-card" onClick={() => onViewChange('premium')}>
          <div className="upgrade-icon">
            <MapPin size={20} color="#a855f7" />
          </div>
          <h3>Upgrade to Pro</h3>
          <p>Unlock advanced analytics, real-time alerts & more.</p>
          <button className="upgrade-btn">Upgrade Now</button>
        </div>

        <div className="user-profile">
          <img src="https://i.pravatar.cc/150?img=11" alt="Arjun Verma" className="avatar" />
          <div className="user-info">
            <h4>Arjun Verma</h4>
            <p>Premium User</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
