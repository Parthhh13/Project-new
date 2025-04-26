import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const supplierService = {
  getAll: () => api.get('/suppliers'),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

export const settingsService = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export const reportService = {
  getSalesReport: (params) => api.get('/reports/sales', { params }),
  getInventoryReport: (params) => api.get('/reports/inventory', { params }),
  getProductReport: (params) => api.get('/reports/products', { params }),
};

export default api; 