import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../api';
import '../styles/EmployeeManagement.css';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response);
      setError('');
    } catch (err) {
      setError('Failed to fetch employees: ' + (err.response?.data?.detail || err.message));
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

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.full_name || !formData.email || !formData.department) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await employeeAPI.add(formData);
      setSuccessMessage('Employee added successfully!');
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
      fetchEmployees();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to add employee: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId, employeeName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${employeeName}" (${employeeId})?\n\nThis action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        setLoading(true);
        await employeeAPI.delete(employeeId);
        setSuccessMessage(`Employee "${employeeName}" deleted successfully!`);
        fetchEmployees();
        setTimeout(() => setSuccessMessage(''), 4000);
      } catch (err) {
        setError('Failed to delete employee: ' + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="employee-management">
      <h2>Employee Management</h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleAddEmployee} className="employee-form">
        <div className="form-group">
          <label htmlFor="employee_id">Employee ID:</label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            placeholder="e.g., EMP001"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="full_name">Full Name:</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Employee'}
        </button>
      </form>

      <div className="employees-list">
        <h3>All Employees</h3>
        {loading ? (
          <p>Loading...</p>
        ) : employees.length === 0 ? (
          <p>No employees found</p>
        ) : (
          <table className="employees-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.employee_id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteEmployee(emp.employee_id, emp.full_name)}
                      disabled={loading}
                      title="Delete this employee"
                    >
                      🗑️ Delete
                    </button>
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

export default EmployeeManagement;
