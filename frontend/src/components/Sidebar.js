import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ activeTab, setActiveTab, isOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'employees', label: 'Employees', icon: '👥' },
    { id: 'attendance', label: 'Quick Attendance', icon: '⚡' },
    { id: 'history', label: 'Attendance History', icon: '📋' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">📊</span>
          {isOpen && <span className="logo-text">HRMS</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isOpen && (
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <p className="user-name">HR Admin</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
