import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../api';
import '../styles/FastAttendance.css';

function FastAttendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadRecentAttendance();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await employeeAPI.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadRecentAttendance = async () => {
    try {
      const data = await attendanceAPI.getAll();
      // Sort by date descending and take the last 5
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentAttendance(sorted.slice(0, 5));
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const handleMarkAttendance = async (status) => {
    if (!selectedEmployee) {
      setNotification({ type: 'error', message: 'Please select an employee' });
      return;
    }

    setLoading(true);
    try {
      await attendanceAPI.add({
        employee_id: selectedEmployee,
        date: selectedDate,
        status: status,
      });

      setNotification({ 
        type: 'success', 
        message: `✓ Marked ${status} for employee ${selectedEmployee}` 
      });

      // Reset selection and reload
      setSelectedEmployee('');
      setSearchTerm('');
      loadRecentAttendance();
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error.response?.data?.detail || 'Error marking attendance' 
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.employee_id === id);
    return emp ? emp.full_name : id;
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'Present': return '#4CAF50';
      case 'Absent': return '#f44336';
      case 'Leave': return '#FFC107';
      default: return '#999';
    }
  };

  const getStatusEmoji = (status) => {
    switch(status) {
      case 'Present': return '✓';
      case 'Absent': return '✗';
      case 'Leave': return '📋';
      default: return '?';
    }
  };

  return (
    <div className="fast-attendance-container">
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="fast-attendance-grid">
        {/* Left Panel - Quick Actions */}
        <div className="quick-actions-panel">
          <div className="panel-header">
            <h2>⚡ Quick Attendance</h2>
            <p>Mark attendance in seconds</p>
          </div>

          <div className="selection-section">
            <label htmlFor="employee-search">Select Employee</label>
            <div className="search-wrapper">
              <input
                id="employee-search"
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="employee-search"
              />
              {searchTerm && (
                <div className="dropdown-list">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map(emp => (
                      <div
                        key={emp.employee_id}
                        className={`dropdown-item ${selectedEmployee === emp.employee_id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedEmployee(emp.employee_id);
                          setSearchTerm('');
                        }}
                      >
                        <span className="emp-name">{emp.full_name}</span>
                        <span className="emp-id">({emp.employee_id})</span>
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-item disabled">No employees found</div>
                  )}
                </div>
              )}
            </div>

            {selectedEmployee && (
              <div className="selected-employee">
                <span>✓ {getEmployeeName(selectedEmployee)}</span>
                <button 
                  className="clear-btn"
                  onClick={() => {
                    setSelectedEmployee('');
                    setSearchTerm('');
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="date-section">
            <label htmlFor="attendance-date">Date</label>
            <input
              id="attendance-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="date-input"
            />
          </div>

          <div className="action-buttons">
            <button
              className="action-btn present-btn"
              onClick={() => handleMarkAttendance('Present')}
              disabled={!selectedEmployee || loading}
              title="Mark as Present (Keyboard: P)"
            >
              <span className="btn-emoji">✓</span>
              <span className="btn-text">Present</span>
            </button>

            <button
              className="action-btn absent-btn"
              onClick={() => handleMarkAttendance('Absent')}
              disabled={!selectedEmployee || loading}
              title="Mark as Absent (Keyboard: A)"
            >
              <span className="btn-emoji">✗</span>
              <span className="btn-text">Absent</span>
            </button>

            <button
              className="action-btn leave-btn"
              onClick={() => handleMarkAttendance('Leave')}
              disabled={!selectedEmployee || loading}
              title="Mark as Leave (Keyboard: L)"
            >
              <span className="btn-emoji">📋</span>
              <span className="btn-text">Leave</span>
            </button>
          </div>

          <div className="instructions">
            <p>💡 Tip: Use keyboard shortcuts</p>
            <p><kbd>P</kbd> = Present | <kbd>A</kbd> = Absent | <kbd>L</kbd> = Leave</p>
          </div>
        </div>

        {/* Right Panel - Recent Attendance */}
        <div className="recent-panel">
          <div className="panel-header">
            <h2>📋 Recent Attendance</h2>
            <p>Last 5 marked entries</p>
          </div>

          <div className="recent-list">
            {recentAttendance.length > 0 ? (
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((record, idx) => (
                    <tr key={idx} className="recent-row">
                      <td className="emp-col">
                        <div className="emp-info">
                          <span className="emp-name-short">{getEmployeeName(record.employee_id)}</span>
                          <span className="emp-id-short">{record.employee_id}</span>
                        </div>
                      </td>
                      <td className="date-col">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="status-col">
                        <span
                          className={`badge badge-${record.status.toLowerCase()}`}
                          style={{ backgroundColor: getStatusBadgeColor(record.status) }}
                        >
                          <span className="badge-emoji">{getStatusEmoji(record.status)}</span>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>📊 No attendance records yet</p>
                <p className="text-muted">Start marking attendance to see history</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FastAttendance;
