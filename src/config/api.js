// Centralized API helpers
// Uses Create React App env variable: REACT_APP_API_BASE_URL
// Ensure to define REACT_APP_API_BASE_URL in .env (e.g., https://your-backend.onrender.com)

import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const apiUrl = (path = '') => {
  if (!API_BASE_URL) return path; // fallback (dev)
  if (!path.startsWith('/')) path = '/' + path;
  return `${API_BASE_URL}${path}`;
};

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Example usage:
// axiosInstance.get('/api/posts');
// fetch(apiUrl('/api/users'));
