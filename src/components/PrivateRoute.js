import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's no token stored, treat as unauthenticated
  let token = null;
  try {
    token = localStorage.getItem('authToken');
  } catch (e) {
    token = null;
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/posts" replace />;
  }

  return children;
};

export default PrivateRoute;

