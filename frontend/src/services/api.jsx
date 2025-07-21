// src/services/api.js
import axios from 'axios';

// Dynamic API base URL for development and production
const getApiBaseUrl = () => {
  // Check if we're in development or production
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Fallback for development
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  
  // Production fallback - your Render backend URL
  return 'https://tummysmiles.onrender.com/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000, // 10 second timeout for production
});

console.log('API Base URL:', getApiBaseUrl());

// Add a request interceptor to always get the latest token
api.interceptors.request.use(
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

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
