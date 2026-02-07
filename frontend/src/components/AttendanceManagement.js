import React, { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from '../api';
import '../styles/AttendanceManagement.css';

function AttendanceManagement() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceRes, employeesRes] = await Promise.all([
        attendanceAPI.getAll(),
        employeeAPI.getAll(),
      ]);
      setAttendance(attendanceRes);
      setEmployees(employeesRes);
      setError('');
    } catch (err) {
      setError('Failed to fetch data: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.date || !formData.status) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await attendanceAPI.add(formData);
      setSuccessMessage('Attendance marked successfully!');
      setFormData({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
      });
      fetchData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to mark attendance: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (employeeId) => {
    const emp = employees.find(e => e.employee_id === employeeId);
    return emp ? emp.full_name : 'Unknown';
  };

  return (
    <div className="attendance-management">
      <h2>Attendance Management</h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleMarkAttendance} className="attendance-form">
        <div className="form-group">
          <label htmlFor="employee_id">Employee:</label>
          <select
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.employee_id} - {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Marking...' : 'Mark Attendance'}
        </button>
      </form>

      <div className="attendance-list">
        <h3>Attendance Records</h3>
        {loading ? (
          <p>Loading...</p>
        ) : attendance.length === 0 ? (
          <p>No attendance records found</p>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, idx) => (
                <tr key={idx}>
                  <td>{record.employee_id}</td>
                  <td>{getEmployeeName(record.employee_id)}</td>
                  <td>{record.date}</td>
                  <td className={`status-${record.status.toLowerCase()}`}>
                    {record.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AttendanceManagement;
