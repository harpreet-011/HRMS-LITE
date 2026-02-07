import React, { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from '../api';
import '../styles/AttendanceHistory.css';

function AttendanceHistory() {
  const [history, setHistory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedEmployee, selectedDate, selectedStatus, history]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [histRes, empRes] = await Promise.all([
        attendanceAPI.getAll(),
        employeeAPI.getAll(),
      ]);
      setHistory(histRes);
      setEmployees(empRes);
      setError('');
    } catch (err) {
      setError('Failed to fetch data: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...history];

    if (selectedEmployee) {
      filtered = filtered.filter(h => h.employee_id === selectedEmployee);
    }

    if (selectedDate) {
      filtered = filtered.filter(h => h.date === selectedDate);
    }

    if (selectedStatus) {
      filtered = filtered.filter(h => h.status === selectedStatus);
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredHistory(filtered);
  };

  const getEmployeeName = (employeeId) => {
    const emp = employees.find(e => e.employee_id === employeeId);
    return emp ? emp.full_name : 'Unknown';
  };

  const getEmployeeDepartment = (employeeId) => {
    const emp = employees.find(e => e.employee_id === employeeId);
    return emp ? emp.department : '-';
  };

  const clearFilters = () => {
    setSelectedEmployee('');
    setSelectedDate('');
    setSelectedStatus('');
  };

  const exportToCSV = () => {
    if (filteredHistory.length === 0) {
      alert('No data to export');
      return;
    }

    let csv = 'Employee ID,Employee Name,Department,Date,Status\n';
    filteredHistory.forEach(record => {
      csv += `${record.employee_id},${getEmployeeName(record.employee_id)},${getEmployeeDepartment(record.employee_id)},${record.date},${record.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStats = () => {
    const stats = {
      total: filteredHistory.length,
      present: filteredHistory.filter(h => h.status === 'Present').length,
      absent: filteredHistory.filter(h => h.status === 'Absent').length,
      leave: filteredHistory.filter(h => h.status === 'Leave').length,
    };
    return stats;
  };

  const stats = getStats();
  const attendanceRate = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="attendance-history">
      <div className="history-header">
        <h2>Attendance History</h2>
        <p>View and analyze detailed attendance records</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <label>Filter by Employee:</label>
            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_id} - {emp.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Filter by Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Filter by Status:</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="clear-btn" onClick={clearFilters}>Clear Filters</button>
            <button className="export-btn" onClick={exportToCSV}>📥 Export CSV</button>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Total Records:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Present:</span>
          <span className="stat-value present">{stats.present}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Absent:</span>
          <span className="stat-value absent">{stats.absent}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Leave:</span>
          <span className="stat-value leave">{stats.leave}</span>
        </div>
        <div className="stat attendance-rate">
          <span className="stat-label">Attendance Rate:</span>
          <span className="stat-value">{attendanceRate}%</span>
        </div>
      </div>

      {/* History Table */}
      <div className="table-container">
        {loading ? (
          <p className="loading">Loading attendance history...</p>
        ) : filteredHistory.length === 0 ? (
          <p className="no-data">No attendance records found</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((record, idx) => {
                const date = new Date(record.date);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                return (
                  <tr key={idx} className={`row-${record.status.toLowerCase()}`}>
                    <td className="date-cell">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="day-cell">{dayName}</td>
                    <td className="emp-id-cell">{record.employee_id}</td>
                    <td className="emp-name-cell">{getEmployeeName(record.employee_id)}</td>
                    <td className="dept-cell">{getEmployeeDepartment(record.employee_id)}</td>
                    <td className="status-cell">
                      <span className={`status-badge status-${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Info */}
      <div className="pagination-info">
        Showing {filteredHistory.length} of {history.length} records
      </div>
    </div>
  );
}

export default AttendanceHistory;
