import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { employeeAPI, attendanceAPI } from '../api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    onLeave: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const prepareChartData = useCallback((atts) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      const dayAttendance = atts.filter(a => a.date === dateStr);
      last7Days.push({
        date: dayName,
        fullDate: dateStr,
        Present: dayAttendance.filter(a => a.status === 'Present').length,
        Absent: dayAttendance.filter(a => a.status === 'Absent').length,
        Leave: dayAttendance.filter(a => a.status === 'Leave').length,
      });
    }
    setChartData(last7Days);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [empRes, attRes] = await Promise.all([
        employeeAPI.getAll(),
        attendanceAPI.getAll(),
      ]);

      const emps = empRes;
      const atts = attRes;

      setEmployees(emps);
      setAttendance(atts);

      // Calculate statistics for today
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = atts.filter(a => a.date === today);

      const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
      const absentCount = todayAttendance.filter(a => a.status === 'Absent').length;
      const leaveCount = todayAttendance.filter(a => a.status === 'Leave').length;

      setStats({
        totalEmployees: emps.length,
        presentToday: presentCount,
        absentToday: absentCount,
        onLeave: leaveCount,
      });

      // Prepare status pie chart data
      setStatusData([
        { name: 'Present', value: presentCount, color: '#27ae60' },
        { name: 'Absent', value: absentCount, color: '#e74c3c' },
        { name: 'Leave', value: leaveCount, color: '#f39c12' },
      ]);

      // Prepare weekly trend data
      prepareChartData(atts);

      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard data: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, prepareChartData]);

  

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Welcome to HRMS Lite - Real-time HR Analytics</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card total-employees">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Employees</h3>
            <p className="stat-value">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="stat-card present">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>Present Today</h3>
            <p className="stat-value">{stats.presentToday}</p>
          </div>
        </div>

        <div className="stat-card absent">
          <div className="stat-icon">✕</div>
          <div className="stat-content">
            <h3>Absent Today</h3>
            <p className="stat-value">{stats.absentToday}</p>
          </div>
        </div>

        <div className="stat-card leave">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>On Leave Today</h3>
            <p className="stat-value">{stats.onLeave}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Attendance Status Today</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Present" fill="#27ae60" />
              <Bar dataKey="Absent" fill="#e74c3c" />
              <Bar dataKey="Leave" fill="#f39c12" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Distribution */}
      <div className="dashboard-section">
        <h3>Department Distribution</h3>
        <div className="department-list">
          {getDepartmentStats(employees).map((dept, idx) => (
            <div key={idx} className="department-item">
              <span className="dept-name">{dept.name}</span>
              <div className="dept-bar">
                <div 
                  className="dept-progress" 
                  style={{ width: `${(dept.count / employees.length) * 100}%` }}
                >
                  {dept.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="dashboard-section">
        <h3>Recent Attendance Records</h3>
        <div className="recent-attendance">
          {attendance.slice(-10).reverse().map((record, idx) => (
            <div key={idx} className="attendance-item">
              <div className="attendance-date">
                {new Date(record.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="attendance-details">
                <span className="emp-id">{record.employee_id}</span>
                <span className={`status-badge status-${record.status.toLowerCase()}`}>
                  {record.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getDepartmentStats(employees) {
  const depts = {};
  employees.forEach(emp => {
    depts[emp.department] = (depts[emp.department] || 0) + 1;
  });
  return Object.entries(depts).map(([name, count]) => ({ name, count }));
}

export default Dashboard;
