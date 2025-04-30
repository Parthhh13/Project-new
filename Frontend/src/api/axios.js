import axios from 'axios';

// Create axios instance with proper configuration
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to handle auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (!error.response) {
      // Network error
      throw new Error('Network error - please check if the backend server is running');
    }
    throw error.response.data;
  }
);

export default instance;
