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

// Attach Authorization header automatically from localStorage `authToken` when present
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        // don't overwrite if already provided explicitly
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      // ignore (e.g., during SSR or unavailable localStorage)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper for fetch users of code paths that use fetch directly
export const authFetch = async (pathOrUrl, options = {}) => {
  const isFullUrl = /^https?:\/\//i.test(pathOrUrl);
  const url = isFullUrl ? pathOrUrl : apiUrl(pathOrUrl);
  const token = (() => {
    try {
      return localStorage.getItem('authToken');
    } catch (e) {
      return null;
    }
  })();

  const headers = Object.assign(
    { 'Content-Type': 'application/json' },
    options.headers || {}
  );

  if (token) headers.Authorization = `Bearer ${token}`;

  const merged = Object.assign({}, options, { headers, credentials: options.credentials || 'include' });
  return fetch(url, merged);
};

// Example usage:
// axiosInstance.get('/api/posts');
// fetch(apiUrl('/api/users'));
