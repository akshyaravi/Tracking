import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

// Applications API
export const applicationsAPI = {
  create: (applicationData) => api.post('/applications', applicationData),
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, statusData) => api.put(`/applications/${id}/status`, statusData),
  getStats: () => api.get('/applications/stats'),
};

// Job Roles API
export const jobRolesAPI = {
  create: (jobRoleData) => api.post('/job-roles', jobRoleData),
  getAll: (params) => api.get('/job-roles', { params }),
  getById: (id) => api.get(`/job-roles/${id}`),
  update: (id, jobRoleData) => api.put(`/job-roles/${id}`, jobRoleData),
  delete: (id) => api.delete(`/job-roles/${id}`),
};

// Bot API
export const botAPI = {
  processUpdates: () => api.post('/bot/process'),
  getActivity: () => api.get('/bot/activity'),
  triggerUpdate: (applicationId, data) => api.post(`/bot/trigger/${applicationId}`, data),
};

export default api;