import React, { createContext, useState, useEffect, useContext } from 'react';
import { axiosInstance } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // axiosInstance already configured with credentials in api.js

  useEffect(() => {
    // Check if user is already logged in
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // If there's no token in localStorage, skip calling protected endpoint
      const token = localStorage.getItem('authToken');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      // If unauthorized, remove stale token
      if (error?.response?.status === 401) {
        try { localStorage.removeItem('authToken'); } catch (e) {}
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
  const response = await axiosInstance.post('/api/auth/login', {
        email,
        password
      });
      setUser(response.data.user);
      // Store token in localStorage as backup
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return { success: true, data: response.data };
    } catch (error) {
      let message = 'Login failed';
      if (error?.response) {
        message = error.response.data?.error || error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
      } else if (error?.request) {
        message = 'Network error. Check API base URL and CORS settings.';
      } else if (error?.message) {
        message = error.message;
      }
      console.error('Login error:', error);
      return { success: false, error: message };
    }
  };

  const register = async (username, email, password, role) => {
    try {
  const response = await axiosInstance.post('/api/auth/register', {
        username,
        email,
        password
      });
      setUser(response.data.user);
      // Store token in localStorage as backup
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return { success: true, data: response.data };
    } catch (error) {
      let message = 'Registration failed';
      if (error?.response) {
        message = error.response.data?.error || error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
      } else if (error?.request) {
        message = 'Network error. Check API base URL and CORS settings.';
      } else if (error?.message) {
        message = error.message;
      }
      console.error('Registration error:', error);
      return { success: false, error: message };
    }
  };

  // Request editor access (Viewer only)
  const requestEditor = async () => {
    try {
  const response = await axiosInstance.post('/api/users/request-editor');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Request failed' };
    }
  };

  // Admin: fetch pending editor requests
  const fetchEditorRequests = async () => {
    try {
  const response = await axiosInstance.get('/api/users/editor-requests');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch requests' };
    }
  };

  const approveEditorRequest = async (userId) => {
    try {
  const response = await axiosInstance.post(`/api/users/editor-requests/${userId}/approve`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Approve failed' };
    }
  };

  const rejectEditorRequest = async (userId) => {
    try {
  const response = await axiosInstance.post(`/api/users/editor-requests/${userId}/reject`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Reject failed' };
    }
  };

  const logout = async () => {
    try {
  await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    requestEditor,
    fetchEditorRequests,
    approveEditorRequest,
    rejectEditorRequest,
    logout,
    checkAuth,
    isAdmin: user?.role === 'Admin',
    isEditor: user?.role === 'Editor',
    isViewer: user?.role === 'Viewer'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

