
import axios from 'axios';

// Set base URL for all API calls - using Vite's env syntax
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8100';

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('learnsphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('learnsphere_token');
      localStorage.removeItem('learnsphere_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
