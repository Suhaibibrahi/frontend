// src/apiClient.js
import axios from 'axios';

// Create an Axios instance with your backend base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Your backend server URL
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: automatically attach the token (if available) to every request
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: optional, to handle auth errors globally
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Token validation error:', error.response.data);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
