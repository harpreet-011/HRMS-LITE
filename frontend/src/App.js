import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import FastAttendance from './components/FastAttendance';
import AttendanceHistory from './components/AttendanceHistory';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="App">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} />
      
      <div className={`main-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className={`app-header ${sidebarOpen ? '' : 'sidebar-closed'}`}>
          <div className="header-left">
            <button 
              className="menu-toggle" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle sidebar"
            >
              ☰
            </button>
            <h1 className="header-title">HRMS Lite</h1>
            <div className="header-search">
              <input type="search" placeholder="Search employees..." className="search-box" />
            </div>
          </div>

          <div className="header-right">
            <div className="user-profile">
              <div className="profile-avatar">👤</div>
              <span className="profile-name">HR Admin</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'employees' && <EmployeeManagement />}
          {activeTab === 'attendance' && <FastAttendance />}
          {activeTab === 'history' && <AttendanceHistory />}
        </main>
      </div>

      <footer className={`app-footer ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        <p>&copy; 2024 HRMS Lite - Human Resource Management System | Powered by React & FastAPI</p>
      </footer>
    </div>
  );
}

export default App;
