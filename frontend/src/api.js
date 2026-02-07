import axios from 'axios';

const API_BASE_URL = 'https://hrms-lite-qavm.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee endpoints
export const employeeAPI = {
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },
  add: async (employee) => {
    const response = await api.post('/employees', employee);
    return response.data;
  },
  delete: async (employeeId) => {
    const response = await api.delete(`/employees/${employeeId}`);
    return response.data;
  },
};

// Attendance endpoints
export const attendanceAPI = {
  getAll: async () => {
    const response = await api.get('/attendance');
    return response.data;
  },
  add: async (attendance) => {
    const response = await api.post('/attendance', attendance);
    return response.data;
  },
  getByEmployee: async (employeeId) => {
    const response = await api.get(`/attendance/${employeeId}`);
    return response.data;
  },
};

export default api;
